import { query } from '../db/connection';

export interface ImageAsset {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  uploaded_at: Date;
}

export interface CreateImageAssetData {
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
}

export class ImageAssetModel {
  // 创建图片资产记录
  static async create(data: CreateImageAssetData): Promise<ImageAsset> {
    const { filename, original_name, url, size, mime_type } = data;

    const result = await query(
      `INSERT INTO image_assets (filename, original_name, url, size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [filename, original_name, url, size, mime_type]
    );

    return result.rows[0];
  }

  // 根据 ID 获取图片资产
  static async findById(id: string): Promise<ImageAsset | null> {
    const result = await query('SELECT * FROM image_assets WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // 获取所有图片资产
  static async findAll(limit: number = 50): Promise<ImageAsset[]> {
    const result = await query(
      'SELECT * FROM image_assets ORDER BY uploaded_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  // 删除图片资产记录
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM image_assets WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}
