/**
 * Gallery Model - 相册数据模型
 * 
 * 数据结构：id, title, imgUrl, category, description, createdAt
 * 与 Admin 管理页面集成
 */

import { query } from '../db/connection';

// ========================================
// 数据类型定义
// ========================================

export interface GalleryItem {
  id: string;
  title: string;
  img_url: string;
  category: string;
  description: string | null;
  album_id: string | null;
  showcase_order: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateGalleryData {
  title: string;
  img_url: string;
  category: string;
  description?: string;
  album_id?: string;
}

export interface UpdateGalleryData {
  title?: string;
  img_url?: string;
  category?: string;
  description?: string;
  album_id?: string | null;
  showcase_order?: number | null;
}

// ========================================
// Gallery Model 类
// ========================================

export class GalleryModel {
  /**
   * 创建相册项
   */
  static async create(data: CreateGalleryData): Promise<GalleryItem> {
    const { title, img_url, category, description, album_id } = data;
    
    const result = await query(
      `INSERT INTO gallery (title, img_url, category, description, album_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, img_url, category, description || null, album_id || null]
    );
    
    return result.rows[0];
  }

  /**
   * 根据 ID 获取相册项
   */
  static async findById(id: string): Promise<GalleryItem | null> {
    const result = await query('SELECT * FROM gallery WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * 获取所有相册项（管理后台用）
   */
  static async findAll(): Promise<GalleryItem[]> {
    const result = await query(
      'SELECT * FROM gallery ORDER BY created_at DESC'
    );
    return result.rows;
  }

  /**
   * 【分类筛选】根据分类获取相册项
   */
  static async findByCategory(category: string): Promise<GalleryItem[]> {
    const result = await query(
      'SELECT * FROM gallery WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    return result.rows;
  }

  /**
   * 【图片集筛选】根据图片集ID获取图片
   */
  static async findByAlbumId(albumId: string): Promise<GalleryItem[]> {
    const result = await query(
      'SELECT * FROM gallery WHERE album_id = $1 ORDER BY created_at DESC',
      [albumId]
    );
    return result.rows;
  }

  /**
   * 获取所有分类列表
   */
  static async getCategories(): Promise<string[]> {
    const result = await query(
      'SELECT DISTINCT category FROM gallery ORDER BY category'
    );
    return result.rows.map((row: { category: string }) => row.category);
  }

  /**
   * 分页获取相册项
   */
  static async findPaginated(
    page: number = 1,
    limit: number = 12,
    category?: string
  ): Promise<{
    items: GalleryItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM gallery';
    let itemsQuery = 'SELECT * FROM gallery';
    const params: any[] = [];
    
    // 分类筛选
    if (category && category !== 'all') {
      countQuery += ' WHERE category = $1';
      itemsQuery += ' WHERE category = $1';
      params.push(category);
    }
    
    // 获取总数
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);
    
    // 获取分页数据
    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;
    itemsQuery += ` ORDER BY created_at DESC LIMIT $${limitParam} OFFSET $${offsetParam}`;
    params.push(limit, offset);
    
    const result = await query(itemsQuery, params);
    
    return {
      items: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }


  /**
   * 更新相册项
   */
  static async update(id: string, data: UpdateGalleryData): Promise<GalleryItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.img_url !== undefined) {
      fields.push(`img_url = $${paramIndex++}`);
      values.push(data.img_url);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramIndex++}`);
      values.push(data.category);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.album_id !== undefined) {
      fields.push(`album_id = $${paramIndex++}`);
      values.push(data.album_id);
    }
    if (data.showcase_order !== undefined) {
      fields.push(`showcase_order = $${paramIndex++}`);
      values.push(data.showcase_order);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE gallery SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * 获取长廊展示图片（按 showcase_order 排序）
   */
  static async findShowcaseItems(): Promise<GalleryItem[]> {
    const result = await query(
      'SELECT * FROM gallery WHERE showcase_order IS NOT NULL ORDER BY showcase_order ASC'
    );
    return result.rows;
  }

  /**
   * 批量更新长廊展示配置
   */
  static async updateShowcaseConfig(items: { id: string; showcase_order: number | null }[]): Promise<void> {
    // 先清除所有长廊配置
    await query('UPDATE gallery SET showcase_order = NULL WHERE showcase_order IS NOT NULL');
    
    // 设置新的长廊配置
    for (const item of items) {
      if (item.showcase_order !== null) {
        await query(
          'UPDATE gallery SET showcase_order = $1 WHERE id = $2',
          [item.showcase_order, item.id]
        );
      }
    }
  }

  /**
   * 删除相册项
   */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM gallery WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * 获取相册总数
   */
  static async count(): Promise<number> {
    const result = await query('SELECT COUNT(*) FROM gallery');
    return parseInt(result.rows[0].count, 10);
  }
}
