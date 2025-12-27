import { query } from '../db/connection';
import { TagModel, Tag } from './Tag';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  tags?: Tag[]; // 可选的标签数组
}

export interface CreateArticleData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
}

export interface UpdateArticleData {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: 'draft' | 'published';
}

export class ArticleModel {
  // 创建文章
  static async create(data: CreateArticleData): Promise<Article> {
    const { title, slug, content, excerpt, status } = data;
    const published_at = status === 'published' ? new Date() : null;

    const result = await query(
      `INSERT INTO articles (title, slug, content, excerpt, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, slug, content, excerpt || null, status, published_at]
    );

    return result.rows[0];
  }

  // 根据 ID 获取文章
  static async findById(id: string): Promise<Article | null> {
    const result = await query('SELECT * FROM articles WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // 根据 slug 获取文章
  static async findBySlug(slug: string): Promise<Article | null> {
    const result = await query('SELECT * FROM articles WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  }

  // 获取所有文章（管理后台用）
  static async findAll(): Promise<Article[]> {
    const result = await query(
      'SELECT * FROM articles ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // 获取已发布的文章（前台用）
  static async findPublished(page: number = 1, limit: number = 10, tagSlug?: string): Promise<{
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    let countQuery = "SELECT COUNT(DISTINCT a.id) FROM articles a WHERE a.status = 'published'";
    let articlesQuery = `
      SELECT DISTINCT a.* FROM articles a 
      WHERE a.status = 'published'
    `;
    const countParams: any[] = [];
    const articlesParams: any[] = [];

    // 如果指定了标签，添加 JOIN 和 WHERE 条件
    if (tagSlug) {
      countQuery = `
        SELECT COUNT(DISTINCT a.id) FROM articles a
        INNER JOIN article_tags at ON a.id = at.article_id
        INNER JOIN tags t ON at.tag_id = t.id
        WHERE a.status = 'published' AND t.slug = $1
      `;
      articlesQuery = `
        SELECT DISTINCT a.* FROM articles a
        INNER JOIN article_tags at ON a.id = at.article_id
        INNER JOIN tags t ON at.tag_id = t.id
        WHERE a.status = 'published' AND t.slug = $1
      `;
      countParams.push(tagSlug);
      articlesParams.push(tagSlug);
    }

    // 获取总数
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    // 获取文章列表
    articlesQuery += ` ORDER BY a.published_at DESC LIMIT $${articlesParams.length + 1} OFFSET $${articlesParams.length + 2}`;
    articlesParams.push(limit, offset);
    
    const result = await query(articlesQuery, articlesParams);

    // 为每篇文章加载标签
    const articles = await Promise.all(
      result.rows.map(async (article: Article) => ({
        ...article,
        tags: await TagModel.findByArticleId(article.id),
      }))
    );

    return {
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 更新文章
  static async update(id: string, data: UpdateArticleData): Promise<Article | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.slug !== undefined) {
      fields.push(`slug = $${paramIndex++}`);
      values.push(data.slug);
    }
    if (data.content !== undefined) {
      fields.push(`content = $${paramIndex++}`);
      values.push(data.content);
    }
    if (data.excerpt !== undefined) {
      fields.push(`excerpt = $${paramIndex++}`);
      values.push(data.excerpt);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);

      // 如果状态改为 published，设置 published_at
      if (data.status === 'published') {
        fields.push(`published_at = $${paramIndex++}`);
        values.push(new Date());
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE articles SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  // 删除文章
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM articles WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // 获取文章总数
  static async count(): Promise<number> {
    const result = await query('SELECT COUNT(*) FROM articles WHERE status = $1', ['published']);
    return parseInt(result.rows[0].count, 10);
  }

  // 检查 slug 是否已存在
  static async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    let queryText = 'SELECT id FROM articles WHERE slug = $1';
    const params: any[] = [slug];

    if (excludeId) {
      queryText += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await query(queryText, params);
    return result.rows.length > 0;
  }
}
