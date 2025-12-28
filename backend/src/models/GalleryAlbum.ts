/**
 * GalleryAlbum Model - 图片集数据模型
 */

import { query } from '../db/connection';

export interface GalleryAlbum {
  id: string;
  name: string;
  description: string | null;
  cover_image_id: string | null;
  cover_url?: string;
  image_count?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAlbumData {
  name: string;
  description?: string;
  cover_image_id?: string;
}

export class GalleryAlbumModel {
  /**
   * 创建图片集
   */
  static async create(data: CreateAlbumData): Promise<GalleryAlbum> {
    const { name, description, cover_image_id } = data;
    const result = await query(
      `INSERT INTO gallery_albums (name, description, cover_image_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description || null, cover_image_id || null]
    );
    return result.rows[0];
  }

  /**
   * 获取所有图片集（含封面和图片数量）
   */
  static async findAll(): Promise<GalleryAlbum[]> {
    const result = await query(`
      SELECT 
        a.*,
        g.img_url as cover_url,
        (SELECT COUNT(*) FROM gallery WHERE album_id = a.id) as image_count
      FROM gallery_albums a
      LEFT JOIN gallery g ON g.id = a.cover_image_id
      ORDER BY a.created_at DESC
    `);
    return result.rows;
  }

  /**
   * 根据 ID 获取图片集
   */
  static async findById(id: string): Promise<GalleryAlbum | null> {
    const result = await query(`
      SELECT 
        a.*,
        g.img_url as cover_url,
        (SELECT COUNT(*) FROM gallery WHERE album_id = a.id) as image_count
      FROM gallery_albums a
      LEFT JOIN gallery g ON g.id = a.cover_image_id
      WHERE a.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  /**
   * 更新图片集
   */
  static async update(id: string, data: Partial<CreateAlbumData>): Promise<GalleryAlbum | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.cover_image_id !== undefined) {
      fields.push(`cover_image_id = $${idx++}`);
      values.push(data.cover_image_id);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await query(
      `UPDATE gallery_albums SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  /**
   * 删除图片集
   */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM gallery_albums WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}
