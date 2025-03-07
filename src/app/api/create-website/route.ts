import clientPromise from '@/app/lib/mongodb';
import { generateCSS } from '@/app/lib/generate/css';
import { generateHTML } from '@/app/lib/generate/html';
import { createImages } from '@/app/lib/generate/images';
import {
  createBucket,
  setBucketPolicy,
  uploadCSSToS3,
  uploadHTMLToS3,
  uploadImagesToS3,
} from '@/app/lib/s3';
import { deleteBucket } from '@/app/lib/s3/delete';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const dbName = process.env.MONGODB_DB;

export async function POST(req: NextRequest) {
  console.log('Starting POST request processing...');

  const body = await req.json();
  console.log('Request body parsed:', JSON.stringify(body, null, 2));

  // Split out a few of the args for use
  const {
    title,
    userId,
    featureImagePrompt,
    testimonialImagePrompt,
    aboutUsImagePrompt,
  } = body;

  if (!userId) {
    console.error('Create site error: User not found');
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    );
  }

  // Remove any non-alphanumeric characters from the filename
  const bucketName = title.replace(/[^a-z0-9]/gi, '').toLowerCase() + '-' + userId;
  console.log('Generated bucket name:', bucketName);

  const client = await clientPromise;
  const collection = client.db(dbName).collection('sites');

  try {
    console.log('Checking if site already exists...');
    const siteResponse = await collection.findOne({
      bucketName: bucketName,
      userId: new ObjectId(userId),
    });
    if (siteResponse) {
      console.error('Create site error: Site already exists');
      return NextResponse.json(
        { error: 'Site already exists.' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Create site error: Error checking if site already exists:', error);
    return NextResponse.json(
      { error: 'Error checking if site already exists.' },
      { status: 500 },
    );
  }

  try {
    console.log('Creating bucket...');
    await createBucket(bucketName);
    console.log('Bucket created successfully.');
  } catch (error) {
    console.error('Create bucket error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred creating the bucket.' },
        { status: 500 },
      );
    }
  }

  try {
    console.log('Setting bucket policy...');
    await setBucketPolicy(bucketName);
    console.log('Bucket policy set successfully.');
  } catch (error) {
    console.error('Set bucket policy error:', error);

    // Delete the bucket if setting policy fails
    console.log('Attempting to delete bucket due to policy setting error...');
    const deleteBucketResponse = await deleteBucket(bucketName);
    console.log('Delete bucket response:', deleteBucketResponse);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred setting the bucket policy.' },
        { status: 500 },
      );
    }
  }

  let images;
  try {
    console.log('Creating images...');
    images = await createImages([
      {
        name: 'featureImage',
        prompt: featureImagePrompt,
        count: 1,
        height: '512',
        width: '512',
      },
      {
        name: 'aboutUsImage',
        prompt: aboutUsImagePrompt,
        count: 1,
        height: '576',
        width: '1024',
      },
      {
        name: 'testimonialImage',
        prompt: testimonialImagePrompt,
        count: 1,
        height: '720',
        width: '720',
      },
    ]);
    console.log('Images created successfully:', images);
  } catch (error) {
    console.error('Generated image files error:', error);

    // Delete the bucket if image creation fails
    console.log('Attempting to delete bucket due to image creation error...');
    const deleteBucketResponse = await deleteBucket(bucketName);
    console.log('Delete bucket response:', deleteBucketResponse);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred in generate images.' },
        { status: 500 },
      );
    }
  }

  // Use a timestamp to always bust cache
  const timestamp = Date.now();

  // Check if an image was generated.
  // We need to do this because the image API sometimes takes awhile and will switch to webhook.
  if (images.featureImage[0]) {
    body.featureImageURL = `http://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/featureImage-0?${timestamp}`;
  } else {
    body.featureImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg?${timestamp}`;
  }

  if (images.aboutUsImage[0]) {
    body.aboutUsImageURL = `http://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/aboutUsImage-0?${timestamp}`;
  } else {
    body.aboutUsImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg`;
  }

  if (images.testimonialImage[0]) {
    body.testimonialImageURL = `http://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/testimonialImage-0?${timestamp}`;
  } else {
    body.testimonialImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg`;
  }

  try {
    console.log('Uploading generated image files to the bucket...');
    await uploadImagesToS3(images, bucketName);
    console.log('Images uploaded successfully.');
  } catch (error) {
    console.error('Uploading generated image files error:', error);

    // Delete the bucket if image upload fails
    console.log('Attempting to delete bucket due to image upload error...');
    const deleteBucketResponse = await deleteBucket(bucketName);
    console.log('Delete bucket response:', deleteBucketResponse);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred in uploading images to your bucket.' },
        { status: 500 },
      );
    }
  }

  let href;
  try {
    console.log('Generating HTML...');
    const { html } = await generateHTML(body, bucketName, false);
    console.log('HTML generated successfully.');

    console.log('Generating CSS...');
    const css = await generateCSS(html);
    console.log('CSS generated successfully.');

    console.log('Uploading CSS to S3...');
    await uploadCSSToS3(css, bucketName);
    console.log('CSS uploaded successfully.');

    console.log('Uploading HTML to S3...');
    href = await uploadHTMLToS3(html, bucketName);
    console.log('HTML uploaded successfully. Href:', href);
  } catch (error) {
    console.error('HTML or CSS error:', error);

    // Delete the bucket if HTML/CSS generation or upload fails
    console.log('Attempting to delete bucket due to HTML/CSS error...');
    const deleteBucketResponse = await deleteBucket(bucketName);
    console.error('Delete bucket response:', deleteBucketResponse);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred in generating and uploading HTML or CSS for your site.' },
        { status: 500 },
      );
    }
  }

  try {
    console.log('Saving site data to the database...');
    const data = await collection.insertOne({
      bucketName: bucketName,
      userId: new ObjectId(userId),
      content: body,
      href: href,
    });
    console.log('Site data saved successfully:', data);

    return NextResponse.json(
      { message: 'Website created successfully!', url: 'The website URL is: ' + href },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error saving site data:', error);

    // Delete the bucket if saving site data fails
    console.log('Attempting to delete bucket due to site data save error...');
    const deleteBucketResponse = await deleteBucket(bucketName);
    console.log('Delete bucket response:', deleteBucketResponse);

    // Return the error so the AI can see it
    if (error instanceof Error) {
      return NextResponse.json({ error: error }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An error occurred while saving your site.' , errorMessage: error},
        { status: 500 },
      );
    }
  }
}