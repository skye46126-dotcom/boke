/**
 * 本地文件存储
 * 用于开发环境或不使用云存储的场景
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { existsSync } from 'fs';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

/**
 * 上传文件到本地存储
 */
export async function uploadToLocal(
  file: File,
  buffer: ArrayBuffer
): Promise<UploadResult> {
  // 生成唯一文件名
  const fileExtension = extname(file.name);
  const filename = `${randomBytes(16).toString('hex')}${fileExtension}`;
  
  // 确保上传目录存在
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'images');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  
  // 保存文件
  const filePath = join(uploadDir, filename);
  await writeFile(filePath, new Uint8Array(buffer));
  
  // 返回公开访问的 URL
  const url = `/uploads/images/${filename}`;
  
  return {
    url,
    filename,
    size: file.size,
  };
}
