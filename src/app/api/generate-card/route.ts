import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get MongoDB client
    const client = await import('@/app/lib/mongodb').then(mod => mod.default);
    const dbName = process.env.MONGODB_DB;
    const userCollection = client.db(dbName).collection('users');
    
    // Check user and credits
    const user = await userCollection.findOne({ email: session.user?.email });
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    // Get request data
    const {
      name,
      title,
      company,
      email,
      phone,
      website,
      address,
      color = '#4F46E5',
      style = 'modern'
    } = await req.json();

    // Validate required fields
    if (!name || !title || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate style
    const validStyles = ['modern', 'classic', 'minimalist', 'bold'];
    if (!validStyles.includes(style)) {
      return NextResponse.json({ error: 'Invalid card style' }, { status: 400 });
    }

    // Deduct 1 credit
    await userCollection.updateOne(
      { email: session.user?.email },
      { $inc: { credits: -1 } }
    );

    // Return card data
    return NextResponse.json({
      cardData: {
        name,
        title,
        company,
        email,
        phone,
        website,
        address,
        color,
        style
      },
      creditsRemaining: user.credits - 1
    });

  } catch (error: any) {
    console.error('Card generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate card' },
      { status: 500 }
    );
  }
}