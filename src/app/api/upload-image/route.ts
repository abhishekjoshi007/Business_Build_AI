import clientPromise from '@/app/lib/mongodb';
import { uploadImagesToS3 } from '@/app/lib/s3';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const dbName = process.env.MONGODB_DB;

interface UploadResponse {
  message: string;
  image: {
    key: string;
    value: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse | { error: string }>> {
  const user = await getToken({ req });

  if (!user || !user._id) {
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    );
  }

  const userId = user._id;

  // Parse the form data
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const field = formData.get('field') as string | null;
  const siteId = formData.get('siteId')?.toString();

  if (!file || !field || !siteId) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const collection = client.db(dbName).collection('sites');

  let site;
  try {
    site = await collection.findOne({
      _id: new ObjectId(siteId),
      userId: new ObjectId(userId),
    });
    if (!site) {
      return NextResponse.json(
        { error: 'Site does not exist.' },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error checking if site exists.' },
      { status: 500 },
    );
  }

  try {
    // Convert the file to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Determine the content type
    const contentType = file.type || 'image/png';

    // Generate the S3 key
    const imageKey = `uploads/${Date.now()}-${file.name}`;

    // Upload the file to S3
    const images = { [field]: [imageBuffer.toString('base64')] };
    const uploadedImages = await uploadImagesToS3(images, site.domain || site.bucketName);

    // Construct the final image URL
    const imageUrl = uploadedImages[field][0];
    const timestamp = Date.now();
    const finalImageUrl = site.domain
      ? `https://${site.domain}/${imageUrl}?${timestamp}`
      : `https://${site.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageUrl}?${timestamp}`;

    // Update the site data in MongoDB
    await collection.updateOne(
      {
        _id: new ObjectId(siteId),
        userId: new ObjectId(userId),
      },
      {
        $set: {
          [`content.${field}URL`]: finalImageUrl,
        },
      },
    );

    // Return the same response format as the image generation route
    return NextResponse.json(
      {
        message: 'Image upload successful.',
        image: {
          key: `${field}URL`, // e.g., "featureImageURL"
          value: finalImageUrl, // e.g., "https://example.com/uploads/image.jpg?1698765432100"
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the image.' },
      { status: 500 },
    );
  }
}