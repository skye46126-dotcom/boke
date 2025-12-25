import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';
import { extname } from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function uploadToS3(
  file: File,
  buffer: ArrayBuffer
): Promise<UploadResult> {
  const fileExtension = extname(file.name);
  const filename = `${randomBytes(16).toString('hex')}${fileExtension}`;
  const key = `images/${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET || '',
    Key: key,
    Body: new Uint8Array(buffer),
    ContentType: file.type,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  const url = process.env.CDN_DOMAIN
    ? `${process.env.CDN_DOMAIN}/${key}`
    : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    url,
    filename,
    size: file.size,
  };
}