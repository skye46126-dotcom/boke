import { NextResponse } from 'next/server';
import { getAlbumById } from '@/content/gallery';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const album = getAlbumById(params.id);
  
  if (!album) {
    return NextResponse.json(
      { success: false, message: '相册不存在' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true, data: album });
}
