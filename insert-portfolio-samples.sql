-- 插入示例作品集文章
-- 这些文章将显示为 Pixel Portfolio 卡片

-- 获取标签 ID（用于后续插入）
DO $$
DECLARE
    portfolio_card_id UUID;
    category_about_id UUID;
    category_skill_id UUID;
    category_featured_id UUID;
    category_album_id UUID;
    article_id UUID;
BEGIN
    -- 获取标签 ID
    SELECT id INTO portfolio_card_id FROM tags WHERE slug = 'portfolio-card';
    SELECT id INTO category_about_id FROM tags WHERE slug = 'category-about';
    SELECT id INTO category_skill_id FROM tags WHERE slug = 'category-skill';
    SELECT id INTO category_featured_id FROM tags WHERE slug = 'category-featured-article';
    SELECT id INTO category_album_id FROM tags WHERE slug = 'category-album';

    -- 文章 1: 关于我 (蓝色卡片)
    INSERT INTO articles (title, slug, content, excerpt, status, published_at)
    VALUES (
        '关于我',
        'about-me',
        E'[link](/articles/about-me)\n\n# 关于我\n\n你好！我是一名充满热情的开发者。\n\n## 我的故事\n\n从小就对计算机充满好奇，大学选择了计算机科学专业。毕业后一直从事 Web 开发工作，热爱创造有趣的产品。\n\n## 兴趣爱好\n\n- 💻 编程\n- 🎮 游戏\n- 📚 阅读\n- 🎵 音乐\n\n## 联系方式\n\n欢迎通过邮件或社交媒体与我联系！',
        '了解更多关于我的信息',
        'published',
        NOW()
    )
    RETURNING id INTO article_id;
    
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, portfolio_card_id);
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, category_about_id);

    -- 文章 2: 我的技能 (绿色卡片)
    INSERT INTO articles (title, slug, content, excerpt, status, published_at)
    VALUES (
        '我的技能',
        'my-skills',
        E'[link](/articles/my-skills)\n\n# 我的技能\n\n## 前端开发\n\n- **React / Next.js** - 熟练使用现代前端框架\n- **TypeScript** - 类型安全的 JavaScript\n- **CSS / Tailwind** - 精通样式设计\n- **响应式设计** - 移动优先的开发方式\n\n## 后端开发\n\n- **Node.js / Express** - 构建 RESTful API\n- **PostgreSQL / MongoDB** - 数据库设计与优化\n- **Docker** - 容器化部署\n\n## 工具与流程\n\n- **Git / GitHub** - 版本控制\n- **CI/CD** - 自动化部署\n- **Agile** - 敏捷开发方法论',
        '我掌握的技术栈和工具',
        'published',
        NOW()
    )
    RETURNING id INTO article_id;
    
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, portfolio_card_id);
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, category_skill_id);

    -- 文章 3: 精选项目 (紫色卡片)
    INSERT INTO articles (title, slug, content, excerpt, status, published_at)
    VALUES (
        '精选项目',
        'featured-projects',
        E'[link](/articles/featured-projects)\n\n# 精选项目\n\n## 🎨 Pixel Portfolio\n\n一个充满像素艺术风格的互动作品集网站。\n\n**技术栈**: Next.js, TypeScript, PostgreSQL\n\n**特点**:\n- 像素风格设计\n- 卡片抽取交互\n- 响应式布局\n\n## 📝 个人博客系统\n\n简洁优雅的博客系统，支持 Markdown 编辑。\n\n**技术栈**: React, Node.js, Express\n\n**特点**:\n- Markdown 支持\n- 代码高亮\n- 标签分类\n\n## 🚀 更多项目\n\n持续更新中...',
        '我最自豪的项目作品',
        'published',
        NOW()
    )
    RETURNING id INTO article_id;
    
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, portfolio_card_id);
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, category_featured_id);

    -- 文章 4: 我的相册 (橙色卡片)
    INSERT INTO articles (title, slug, content, excerpt, status, published_at)
    VALUES (
        '我的相册',
        'my-album',
        E'[link](/articles/my-album)\n\n# 我的相册\n\n记录生活中的美好瞬间。\n\n## 🌅 旅行\n\n去过很多有趣的地方，看过不同的风景。\n\n## 📷 摄影\n\n用镜头捕捉生活的点滴。\n\n## 🎨 创作\n\n一些设计作品和创意项目。\n\n---\n\n*持续更新中...*',
        '生活中的美好瞬间',
        'published',
        NOW()
    )
    RETURNING id INTO article_id;
    
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, portfolio_card_id);
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, category_album_id);

    -- 文章 5: 联系我 (蓝色卡片)
    INSERT INTO articles (title, slug, content, excerpt, status, published_at)
    VALUES (
        '联系我',
        'contact-me',
        E'[link](/articles/contact-me)\n\n# 联系我\n\n很高兴能与你交流！\n\n## 📧 邮箱\n\nhello@example.com\n\n## 🐦 社交媒体\n\n- Twitter: @yourhandle\n- GitHub: @yourusername\n- LinkedIn: /in/yourprofile\n\n## 💬 留言\n\n欢迎通过任何方式与我联系，我会尽快回复！\n\n---\n\n*期待与你的交流*',
        '通过多种方式与我联系',
        'published',
        NOW()
    )
    RETURNING id INTO article_id;
    
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, portfolio_card_id);
    INSERT INTO article_tags (article_id, tag_id) VALUES (article_id, category_about_id);

    RAISE NOTICE '✅ 成功创建 5 篇示例文章！';
END $$;

-- 验证插入结果
SELECT 
    a.title,
    a.slug,
    a.excerpt,
    STRING_AGG(t.name, ', ') as tags
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.slug IN ('about-me', 'my-skills', 'featured-projects', 'my-album', 'contact-me')
GROUP BY a.id, a.title, a.slug, a.excerpt
ORDER BY a.created_at DESC;
