import { NextResponse } from 'next/server';
import { sendMail } from '@/app/config/mail';
import { users } from '@/app/db/userApi';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow requests from any origin
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Updated OPTIONS handler that returns 204 No Content
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, message } = body;

    const user = await users.getById(id);
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: `User not found for id ${id}` },
        { status: 404, headers: corsHeaders }
      );
    }

    await sendMail({
      to: user.email,
      subject: `Contact Form Message from ${name}`,
      text: message,
    });

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500, headers: corsHeaders }
    );
  }
}