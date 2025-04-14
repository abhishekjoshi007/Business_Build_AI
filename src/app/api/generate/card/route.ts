import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { CardPreview } from '@/app/lib/branding/card'; // Adjust the import path

export async function POST(req: NextRequest) {
 c catch (error: any) {
    console.error('Card generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate card' },
      { status: 500 }
    );
  }
}