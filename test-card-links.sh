#!/bin/bash

echo "🔗 测试卡片链接功能"
echo "================================"
echo ""

# 测试 1: 检查前端 API
echo "1️⃣ 测试前端 API (http://localhost:3000/api/articles?tag=portfolio-card)..."
RESPONSE=$(curl -s "http://localhost:3000/api/articles?tag=portfolio-card")

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ 前端 API 正常响应"
    
    # 提取文章数量
    ARTICLE_COUNT=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data['data']['articles']))")
    echo "   找到 $ARTICLE_COUNT 篇作品集文章"
else
    echo "❌ 前端 API 响应失败"
    exit 1
fi
echo ""

# 测试 2: 检查文章链接
echo "2️⃣ 检查文章链接格式..."
echo "$RESPONSE" | python3 -c "
import sys, json, re
data = json.load(sys.stdin)
articles = data['data']['articles']
print('文章链接:')
for article in articles:
    content = article['content']
    match = re.search(r'\[link\]\(([^)]+)\)', content)
    if match:
        link = match.group(1)
        print(f\"  ✅ {article['title']}: {link}\")
        print(f\"     Slug: {article['slug']}\")
    else:
        print(f\"  ❌ {article['title']}: 未找到链接\")
"
echo ""

# 测试 3: 测试文章页面是否可访问
echo "3️⃣ 测试文章页面..."
TEST_SLUGS=("about-me" "my-skills" "featured-projects")

for slug in "${TEST_SLUGS[@]}"; do
    if curl -s "http://localhost:3000/articles/$slug" | grep -q "$slug"; then
        echo "  ✅ /articles/$slug 可访问"
    else
        echo "  ❌ /articles/$slug 无法访问"
    fi
done
echo ""

# 测试 4: 检查首页是否加载 PixelPortfolio
echo "4️⃣ 检查首页组件..."
if curl -s "http://localhost:3000" | grep -q "PixelPortfolio"; then
    echo "✅ 首页正确加载 PixelPortfolio 组件"
else
    echo "❌ 首页未加载 PixelPortfolio 组件"
fi
echo ""

echo "================================"
echo "✅ 测试完成！"
echo ""
echo "💡 如果卡片仍然无法点击，请检查:"
echo "   1. 浏览器控制台是否有 JavaScript 错误"
echo "   2. Card 组件的 Link 是否正确渲染"
echo "   3. 文章的 targetUrl 是否正确提取"
echo ""
echo "🔍 调试建议:"
echo "   - 打开浏览器开发者工具"
echo "   - 检查 Network 标签，查看 API 请求"
echo "   - 检查 Console 标签，查看错误信息"
echo "   - 右键点击卡片，选择 '检查元素' 查看 HTML 结构"
