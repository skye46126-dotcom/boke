#!/bin/bash

echo "🎨 创建 Pixel Portfolio 示例文章"
echo "================================"
echo ""

# 获取管理路径
ADMIN_PATH="manage-panel-48dc3aa0500c1e054b884f878930790ba513280eb53925bf4225e494463158f2"
BASE_URL="http://localhost:3001"

# 获取标签 ID
echo "1️⃣ 获取标签 ID..."
TAGS_JSON=$(curl -s "$BASE_URL/api/tags")

PORTFOLIO_CARD_ID=$(echo $TAGS_JSON | python3 -c "import sys, json; tags = json.load(sys.stdin)['data']; print([t['id'] for t in tags if t['slug'] == 'portfolio-card'][0])")
CATEGORY_ABOUT_ID=$(echo $TAGS_JSON | python3 -c "import sys, json; tags = json.load(sys.stdin)['data']; print([t['id'] for t in tags if t['slug'] == 'category-about'][0])")
CATEGORY_SKILL_ID=$(echo $TAGS_JSON | python3 -c "import sys, json; tags = json.load(sys.stdin)['data']; print([t['id'] for t in tags if t['slug'] == 'category-skill'][0])")
CATEGORY_FEATURED_ID=$(echo $TAGS_JSON | python3 -c "import sys, json; tags = json.load(sys.stdin)['data']; print([t['id'] for t in tags if t['slug'] == 'category-featured-article'][0])")
CATEGORY_ALBUM_ID=$(echo $TAGS_JSON | python3 -c "import sys, json; tags = json.load(sys.stdin)['data']; print([t['id'] for t in tags if t['slug'] == 'category-album'][0])")

echo "✅ 标签 ID 获取成功"
echo "   Portfolio Card: $PORTFOLIO_CARD_ID"
echo "   Category About: $CATEGORY_ABOUT_ID"
echo "   Category Skill: $CATEGORY_SKILL_ID"
echo "   Category Featured: $CATEGORY_FEATURED_ID"
echo "   Category Album: $CATEGORY_ALBUM_ID"
echo ""

# 创建文章 1: 关于我
echo "2️⃣ 创建文章: 关于我..."
curl -s -X POST "$BASE_URL/$ADMIN_PATH/articles" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"关于我\",
    \"slug\": \"about-me\",
    \"content\": \"[link](/articles/about-me)\\n\\n# 关于我\\n\\n你好！我是一名充满热情的开发者。\\n\\n## 我的故事\\n\\n从小就对计算机充满好奇，大学选择了计算机科学专业。毕业后一直从事 Web 开发工作，热爱创造有趣的产品。\\n\\n## 兴趣爱好\\n\\n- 💻 编程\\n- 🎮 游戏\\n- 📚 阅读\\n- 🎵 音乐\\n\\n## 联系方式\\n\\n欢迎通过邮件或社交媒体与我联系！\",
    \"excerpt\": \"了解更多关于我的信息\",
    \"status\": \"published\",
    \"tagIds\": [\"$PORTFOLIO_CARD_ID\", \"$CATEGORY_ABOUT_ID\"]
  }" | python3 -m json.tool | grep -E '"success"|"title"'
echo ""

# 创建文章 2: 我的技能
echo "3️⃣ 创建文章: 我的技能..."
curl -s -X POST "$BASE_URL/$ADMIN_PATH/articles" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"我的技能\",
    \"slug\": \"my-skills\",
    \"content\": \"[link](/articles/my-skills)\\n\\n# 我的技能\\n\\n## 前端开发\\n\\n- **React / Next.js** - 熟练使用现代前端框架\\n- **TypeScript** - 类型安全的 JavaScript\\n- **CSS / Tailwind** - 精通样式设计\\n- **响应式设计** - 移动优先的开发方式\\n\\n## 后端开发\\n\\n- **Node.js / Express** - 构建 RESTful API\\n- **PostgreSQL / MongoDB** - 数据库设计与优化\\n- **Docker** - 容器化部署\\n\\n## 工具与流程\\n\\n- **Git / GitHub** - 版本控制\\n- **CI/CD** - 自动化部署\\n- **Agile** - 敏捷开发方法论\",
    \"excerpt\": \"我掌握的技术栈和工具\",
    \"status\": \"published\",
    \"tagIds\": [\"$PORTFOLIO_CARD_ID\", \"$CATEGORY_SKILL_ID\"]
  }" | python3 -m json.tool | grep -E '"success"|"title"'
echo ""

# 创建文章 3: 精选项目
echo "4️⃣ 创建文章: 精选项目..."
curl -s -X POST "$BASE_URL/$ADMIN_PATH/articles" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"精选项目\",
    \"slug\": \"featured-projects\",
    \"content\": \"[link](/articles/featured-projects)\\n\\n# 精选项目\\n\\n## 🎨 Pixel Portfolio\\n\\n一个充满像素艺术风格的互动作品集网站。\\n\\n**技术栈**: Next.js, TypeScript, PostgreSQL\\n\\n**特点**:\\n- 像素风格设计\\n- 卡片抽取交互\\n- 响应式布局\\n\\n## 📝 个人博客系统\\n\\n简洁优雅的博客系统，支持 Markdown 编辑。\\n\\n**技术栈**: React, Node.js, Express\\n\\n**特点**:\\n- Markdown 支持\\n- 代码高亮\\n- 标签分类\\n\\n## 🚀 更多项目\\n\\n持续更新中...\",
    \"excerpt\": \"我最自豪的项目作品\",
    \"status\": \"published\",
    \"tagIds\": [\"$PORTFOLIO_CARD_ID\", \"$CATEGORY_FEATURED_ID\"]
  }" | python3 -m json.tool | grep -E '"success"|"title"'
echo ""

# 创建文章 4: 我的相册
echo "5️⃣ 创建文章: 我的相册..."
curl -s -X POST "$BASE_URL/$ADMIN_PATH/articles" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"我的相册\",
    \"slug\": \"my-album\",
    \"content\": \"[link](/articles/my-album)\\n\\n# 我的相册\\n\\n记录生活中的美好瞬间。\\n\\n## 🌅 旅行\\n\\n去过很多有趣的地方，看过不同的风景。\\n\\n## 📷 摄影\\n\\n用镜头捕捉生活的点滴。\\n\\n## 🎨 创作\\n\\n一些设计作品和创意项目。\\n\\n---\\n\\n*持续更新中...*\",
    \"excerpt\": \"生活中的美好瞬间\",
    \"status\": \"published\",
    \"tagIds\": [\"$PORTFOLIO_CARD_ID\", \"$CATEGORY_ALBUM_ID\"]
  }" | python3 -m json.tool | grep -E '"success"|"title"'
echo ""

# 创建文章 5: 联系我
echo "6️⃣ 创建文章: 联系我..."
curl -s -X POST "$BASE_URL/$ADMIN_PATH/articles" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"联系我\",
    \"slug\": \"contact-me\",
    \"content\": \"[link](/articles/contact-me)\\n\\n# 联系我\\n\\n很高兴能与你交流！\\n\\n## 📧 邮箱\\n\\nhello@example.com\\n\\n## 🐦 社交媒体\\n\\n- Twitter: @yourhandle\\n- GitHub: @yourusername\\n- LinkedIn: /in/yourprofile\\n\\n## 💬 留言\\n\\n欢迎通过任何方式与我联系，我会尽快回复！\\n\\n---\\n\\n*期待与你的交流*\",
    \"excerpt\": \"通过多种方式与我联系\",
    \"status\": \"published\",
    \"tagIds\": [\"$PORTFOLIO_CARD_ID\", \"$CATEGORY_ABOUT_ID\"]
  }" | python3 -m json.tool | grep -E '"success"|"title"'
echo ""

echo "================================"
echo "✅ 示例文章创建完成！"
echo ""
echo "📊 创建的文章:"
echo "1. 关于我 (蓝色卡片)"
echo "2. 我的技能 (绿色卡片)"
echo "3. 精选项目 (紫色卡片)"
echo "4. 我的相册 (橙色卡片)"
echo "5. 联系我 (蓝色卡片)"
echo ""
echo "🎮 现在访问 http://localhost:3000 查看效果！"
