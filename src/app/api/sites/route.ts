import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Site } from '@/old.types/site'
import { revalidateTag } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'

const dbName = process.env.MONGODB_DB
export const revalidate = 3

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!session) {
    console.log("Unauthorized");
    return NextResponse.json({message: "Unauthorized."}, { status: 403 });
  }

  const client = await import('@/app/lib/mongodb').then(mod => mod.default);
  const dbName = process.env.MONGODB_DB;
  const userCollection = client.db(dbName).collection('users');


  const { user } = session;
  if (!user || user.credits <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }
  if (!user || !user?._id) {
    console.log("User is required");
    return NextResponse.json({message: "Unauthorized. User is required"}, { status: 403 });
  }

  const tag = req.nextUrl.searchParams.get('tag')
  tag && revalidateTag(tag)

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
    const siteResponse = collection.find({
      userId: new ObjectId(user._id),
    })

    const sites = await siteResponse.toArray()

    // Convert each object in the array
    const simpleDataArray = sites.map((data) => ({
      _id: data._id.toString() as string, // convert ObjectId to string
      bucketName: data.bucketName as string,
      userId: data.userId.toString() as string, // convert ObjectId to string
      content: data.content as object,
      href: data.href as string,
    }))
    await userCollection.updateOne(
      { email: session.user?.email },
      { $inc: { credits: -1 } }
    );

    return NextResponse.json(
      { sites: simpleDataArray as Site[] },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
