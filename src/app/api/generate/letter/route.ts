import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await import('@/app/lib/mongodb').then(mod => mod.default);
    const dbName = process.env.MONGODB_DB;
    const userCollection = client.db(dbName).collection('users');
    const user = await userCollection.findOne({ email: session.user?.email });

    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    const letterData = await req.json();

    if (!letterData || !letterData.senderName || !letterData.senderCompany || !letterData.senderEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate style
    const validStyles = ['modern', 'classic', 'minimalist'];
    if (letterData.style && !validStyles.includes(letterData.style)) {
      return NextResponse.json({ error: 'Invalid letter style' }, { status: 400 });
    }

    // Deduct 1 credit after successful generation
    await userCollection.updateOne(
      { email: session.user?.email },
      { $inc: { credits: -1 } }
    );

    // Return the letter data and remaining credits
    return NextResponse.json({
      result: letterData,
      creditsRemaining: user.credits - 1
    });

  } catch (error: any) {
    console.error('Letter generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate letter' },
      { status: 500 }
    );
  }
}