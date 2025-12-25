import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config';
import { randomBytes } from 'crypto';
import { extname } from 'path';

const s3Client = new S3Client({
  region: config.storage.aws.region,
  credentials: {
    accessKeyId: config.storage.aws.accessKeyId,
    secretAccessKey: config.storage.aws.secretAccessKey,
  },
});

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function uploadToS3(
  file: Express.Multer.File
): Promise<UploadResult> {
  const fileExtension = extname(file.originalname);
  const filename = `${randomBytes(16).toString('hex')}${fileExtension}`;
  const key = `images/${filename}`;

  const command = new PutObjectCommand({
    Bucket: config.storage.aws.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  const url = config.cdn.domain
    ? `${config.cdn.domain}/${key}`
    : `https://${config.storage.aws.bucket}.s3.${config.storage.aws.region}.amazonaws.com/${key}`;

  return {
    url,
    filename,
    size: file.size,
  };
}
