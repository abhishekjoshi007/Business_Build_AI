import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get MongoDB client
  const client = await import('@/app/lib/mongodb').then(mod => mod.default);
  const dbName = process.env.MONGODB_DB;
  const userCollection = client.db(dbName).collection('users');
  
  // Check user and credits
  const usercred = await userCollection.findOne({ email: session.user?.email });
  if (!usercred || usercred.credits <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }

  return NextResponse.json({ verified: true });
}