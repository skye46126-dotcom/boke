import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const albumsFile = path.join(process.cwd(), 'content/gallery/albums.json');

export async function GET() {
  try {
    const content = fs.readFileSync(albumsFile, 'utf8');
    const data = JSON.parse(content);
    
    return NextResponse.json({
      success: true,
      albums: data.albums || [],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '读取相册列表失败',
      albums: [],
    });
  }
}
