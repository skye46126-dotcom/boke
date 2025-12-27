import { query } from '../db/connection';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface CreateTagData {
  name: string;
  slug: string;
}

export class TagModel {
  // 创建标签
  static async create(data: CreateTagData): Promise<Tag> {
    const { name, slug } = data;

    const result = await query(
      `INSERT INTO tags (name, slug)
       VALUES ($1, $2)
       RETURNING *`,
      [name, slug]
    );

    return result.rows[0];
  }

  // 根据 ID 获取标签
  static async findById(id: string): Promise<Tag | null> {
    const result = await query('SELECT * FROM tags WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // 根据 slug 获取标签
  static async findBySlug(slug: string): Promise<Tag | null> {
    const result = await query('SELECT * FROM tags WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  }

  // 获取所有标签
  static async findAll(): Promise<Tag[]> {
    const result = await query('SELECT * FROM tags ORDER BY name ASC');
    return result.rows;
  }

  // 获取文章的所有标签
  static async findByArticleId(articleId: string): Promise<Tag[]> {
    const result = await query(
      `SELECT t.* FROM tags t
       INNER JOIN article_tags at ON t.id = at.tag_id
       WHERE at.article_id = $1
       ORDER BY t.name ASC`,
      [articleId]
    );
    return result.rows;
  }

  // 为文章添加标签
  static async addToArticle(articleId: string, tagId: string): Promise<void> {
    await query(
      `INSERT INTO article_tags (article_id, tag_id)
       VALUES ($1, $2)
       ON CONFLICT (article_id, tag_id) DO NOTHING`,
      [articleId, tagId]
    );
  }

  // 从文章移除标签
  static async removeFromArticle(articleId: string, tagId: string): Promise<void> {
    await query(
      `DELETE FROM article_tags
       WHERE article_id = $1 AND tag_id = $2`,
      [articleId, tagId]
    );
  }

  // 设置文章的标签（替换所有现有标签）
  static async setArticleTags(articleId: string, tagIds: string[]): Promise<void> {
    // 开始事务
    await query('BEGIN');

    try {
      // 删除现有标签
      await query('DELETE FROM article_tags WHERE article_id = $1', [articleId]);

      // 添加新标签
      if (tagIds.length > 0) {
        const values = tagIds.map((tagId, index) => 
          `($1, $${index + 2})`
        ).join(', ');
        
        await query(
          `INSERT INTO article_tags (article_id, tag_id)
           VALUES ${values}`,
          [articleId, ...tagIds]
        );
      }

      await query('COMMIT');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }

  // 删除标签
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM tags WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // 获取标签总数
  static async count(): Promise<number> {
    const result = await query('SELECT COUNT(*) FROM tags');
    return parseInt(result.rows[0].count, 10);
  }

  // 检查 slug 是否已存在
  static async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    let queryText = 'SELECT id FROM tags WHERE slug = $1';
    const params: any[] = [slug];

    if (excludeId) {
      queryText += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await query(queryText, params);
    return result.rows.length > 0;
  }
}
