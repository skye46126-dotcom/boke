/**
 * Property-Based Tests for Article Model
 * Feature: personal-blog, Property 6: Article Data Integrity
 * Validates: Requirements 5.2, 5.3, 5.4, 5.5, 7.4, 7.5
 */

import * as fc from 'fast-check';
import { ArticleModel, CreateArticleData, UpdateArticleData } from '../Article';

// Mock the database connection
jest.mock('../../db/connection', () => ({
  query: jest.fn(),
}));

import { query } from '../../db/connection';
const mockQuery = query as jest.MockedFunction<typeof query>;

// Generators for property-based testing
const articleTitleArb = fc.string({ minLength: 1, maxLength: 255 });
const articleSlugArb = fc.string({ minLength: 1, maxLength: 255 }).map(s => 
  s.toLowerCase().replace(/[^a-z0-9-]/g, '-')
);
const articleContentArb = fc.string({ minLength: 1, maxLength: 10000 });
const articleExcerptArb = fc.option(fc.string({ maxLength: 500 }), { nil: null });
const articleStatusArb = fc.constantFrom('draft' as const, 'published' as const);

const createArticleDataArb: fc.Arbitrary<CreateArticleData> = fc.record({
  title: articleTitleArb,
  slug: articleSlugArb,
  content: articleContentArb,
  excerpt: articleExcerptArb.map(v => v || undefined),
  status: articleStatusArb,
});

describe('Article Model - Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 6: Article Data Integrity
   * For any article creation, update, or status change operation,
   * all article properties should be preserved accurately and persist correctly
   */
  describe('Property 6: Article Data Integrity', () => {
    it('should preserve all properties when creating an article', async () => {
      await fc.assert(
        fc.asyncProperty(createArticleDataArb, async (articleData) => {
          const mockArticle = {
            id: 'test-uuid',
            ...articleData,
            excerpt: articleData.excerpt || null,
            created_at: new Date(),
            updated_at: new Date(),
            published_at: articleData.status === 'published' ? new Date() : null,
          };

          mockQuery.mockResolvedValueOnce({
            rows: [mockArticle],
            rowCount: 1,
          } as any);

          const result = await ArticleModel.create(articleData);

          // Verify all properties are preserved
          expect(result.title).toBe(articleData.title);
          expect(result.slug).toBe(articleData.slug);
          expect(result.content).toBe(articleData.content);
          expect(result.status).toBe(articleData.status);
          
          // Verify excerpt handling
          if (articleData.excerpt) {
            expect(result.excerpt).toBe(articleData.excerpt);
          }

          // Verify published_at is set correctly
          if (articleData.status === 'published') {
            expect(result.published_at).toBeTruthy();
          } else {
            expect(result.published_at).toBeNull();
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve properties when updating an article', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.record({
            title: fc.option(articleTitleArb, { nil: undefined }),
            content: fc.option(articleContentArb, { nil: undefined }),
            status: fc.option(articleStatusArb, { nil: undefined }),
          }),
          async (id, updateData) => {
            const existingArticle = {
              id,
              title: 'Original Title',
              slug: 'original-slug',
              content: 'Original content',
              excerpt: null,
              status: 'draft' as const,
              created_at: new Date(),
              updated_at: new Date(),
              published_at: null,
            };

            const updatedArticle = {
              ...existingArticle,
              ...updateData,
              updated_at: new Date(),
            };

            mockQuery.mockResolvedValueOnce({
              rows: [updatedArticle],
              rowCount: 1,
            } as any);

            const result = await ArticleModel.update(id, updateData);

            // Verify updated properties are preserved
            if (updateData.title) {
              expect(result?.title).toBe(updateData.title);
            }
            if (updateData.content) {
              expect(result?.content).toBe(updateData.content);
            }
            if (updateData.status) {
              expect(result?.status).toBe(updateData.status);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly filter published articles', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              title: articleTitleArb,
              slug: articleSlugArb,
              content: articleContentArb,
              excerpt: articleExcerptArb,
              status: articleStatusArb,
              created_at: fc.date(),
              updated_at: fc.date(),
              published_at: fc.option(fc.date(), { nil: null }),
            }),
            { minLength: 0, maxLength: 50 }
          ),
          async (articles) => {
            const publishedArticles = articles.filter(a => a.status === 'published');
            
            mockQuery.mockResolvedValueOnce({
              rows: [{ count: publishedArticles.length.toString() }],
              rowCount: 1,
            } as any);

            mockQuery.mockResolvedValueOnce({
              rows: publishedArticles,
              rowCount: publishedArticles.length,
            } as any);

            const result = await ArticleModel.findPublished(1, 10);

            // Verify only published articles are returned
            expect(result.articles.every(a => a.status === 'published')).toBe(true);
            expect(result.total).toBe(publishedArticles.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain data integrity when changing status from draft to published', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          createArticleDataArb,
          async (id, articleData) => {
            // Start with draft
            const draftArticle = {
              id,
              ...articleData,
              status: 'draft' as const,
              excerpt: articleData.excerpt || null,
              created_at: new Date(),
              updated_at: new Date(),
              published_at: null,
            };

            // Update to published
            const publishedArticle = {
              ...draftArticle,
              status: 'published' as const,
              published_at: new Date(),
            };

            mockQuery.mockResolvedValueOnce({
              rows: [publishedArticle],
              rowCount: 1,
            } as any);

            const result = await ArticleModel.update(id, { status: 'published' });

            // Verify status change and published_at is set
            expect(result?.status).toBe('published');
            expect(result?.published_at).toBeTruthy();
            
            // Verify other properties remain unchanged
            expect(result?.title).toBe(draftArticle.title);
            expect(result?.content).toBe(draftArticle.content);
            expect(result?.slug).toBe(draftArticle.slug);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
