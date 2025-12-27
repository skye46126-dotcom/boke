#!/bin/bash

echo "🔍 验证 Pixel Portfolio 系统"
echo "================================"
echo ""

# 测试 1: 检查作品集文章数量
echo "1️⃣ 检查作品集文章..."
ARTICLE_COUNT=$(curl -s "http://localhost:3001/api/articles?tag=portfolio-card" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data['data']['articles']))")

if [ "$ARTICLE_COUNT" -ge 5 ]; then
    echo "✅ 找到 $ARTICLE_COUNT 篇作品集文章"
else
    echo "❌ 作品集文章数量不足: $ARTICLE_COUNT"
    exit 1
fi
echo ""

# 测试 2: 检查文章标签
echo "2️⃣ 检查文章标签..."
curl -s "http://localhost:3001/api/articles?tag=portfolio-card" | python3 -c "
import sys, json
data = json.load(sys.stdin)
articles = data['data']['articles']
print('文章列表:')
for article in articles:
    tags = [tag['name'] for tag in article.get('tags', [])]
    print(f\"  - {article['title']}: {', '.join(tags)}\")
"
echo ""

# 测试 3: 检查前端首页
echo "3️⃣ 检查前端首页..."
if curl -s http://localhost:3000 | grep -q "PixelPortfolio"; then
    echo "✅ 前端首页正常加载"
else
    echo "❌ 前端首页加载失败"
    exit 1
fi
echo ""

# 测试 4: 检查卡片链接格式
echo "4️⃣ 检查卡片链接格式..."
curl -s "http://localhost:3001/api/articles?tag=portfolio-card" | python3 -c "
import sys, json, re
data = json.load(sys.stdin)
articles = data['data']['articles']
print('卡片链接:')
for article in articles:
    content = article['content']
    match = re.search(r'\[link\]\(([^)]+)\)', content)
    if match:
        print(f\"  ✅ {article['title']}: {match.group(1)}\")
    else:
        print(f\"  ❌ {article['title']}: 未找到链接\")
"
echo ""

echo "================================"
echo "✅ 验证完成！"
echo ""
echo "🎮 现在可以访问以下链接:"
echo "   - 首页: http://localhost:3000"
echo "   - 关于我: http://localhost:3000/articles/about-me"
echo "   - 我的技能: http://localhost:3000/articles/my-skills"
echo "   - 精选项目: http://localhost:3000/articles/featured-projects"
echo "   - 我的相册: http://localhost:3000/articles/my-album"
echo "   - 联系我: http://localhost:3000/articles/contact-me"
echo ""
echo "💡 提示:"
echo "   1. 点击 'Draw Card' 抽取卡片"
echo "   2. 卡片颜色代表不同类别"
echo "   3. 点击卡片跳转到文章页面"
