import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Add authentication check here in production
  // @ts-ignore - env is available in edge runtime
  const env = request.env || {};
  const db = await getDB(env);
  
  try {
    const [content, services, bookings] = await Promise.all([
      db.prepare('SELECT * FROM content ORDER BY key').bind().all(),
      db.prepare('SELECT * FROM services ORDER BY category, title').bind().all(),
      db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').bind().all()
    ]);

    return NextResponse.json({
      content: content.results,
      services: services.results, 
      bookings: bookings.results
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
