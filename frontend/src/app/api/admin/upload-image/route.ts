import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const imagesFile = path.join(process.cwd(), 'content/gallery/images.json');
const uploadDir = path.join(process.cwd(), 'public/images/gallery');

// 确保上传目录存在
function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// 读取现有图片数据
function readImagesData(): { images: any[] } {
  try {
    const content = fs.readFileSync(imagesFile, 'utf8');
    return JSON.parse(content);
  } catch {
    return { images: [] };
  }
}

// 保存图片数据
function saveImagesData(data: { images: any[] }) {
  fs.writeFileSync(imagesFile, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const album_id = formData.get('album_id') as string || '';
    const category = formData.get('category') as string || 'other';
    const order = parseInt(formData.get('order') as string) || 0;

    if (!file || !id || !title) {
      return NextResponse.json({
        success: false,
        message: '缺少必要参数',
      }, { status: 400 });
    }

    // 确保上传目录存在
    ensureUploadDir();

    // 生成文件名
    const ext = path.extname(file.name);
    const filename = `${id}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    // 更新 images.json
    const data = readImagesData();
    
    // 检查是否已存在同ID的图片
    const existingIndex = data.images.findIndex(img => img.id === id);
    
    const imageData = {
      id,
      title,
      description,
      img_url: `/images/gallery/${filename}`,
      category,
      album_id,
      order,
    };

    if (existingIndex >= 0) {
      data.images[existingIndex] = imageData;
    } else {
      data.images.push(imageData);
    }

    saveImagesData(data);

    return NextResponse.json({
      success: true,
      message: '上传成功',
      image: imageData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      message: '上传失败',
    }, { status: 500 });
  }
}
