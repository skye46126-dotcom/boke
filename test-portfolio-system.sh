#!/bin/bash

echo "🧪 测试 Pixel Portfolio 系统"
echo "================================"
echo ""

# 测试 1: 检查 Docker 容器
echo "1️⃣ 检查 PostgreSQL 容器..."
if docker ps | grep -q blog_postgres; then
    echo "✅ PostgreSQL 容器正在运行"
else
    echo "❌ PostgreSQL 容器未运行"
    exit 1
fi
echo ""

# 测试 2: 检查数据库连接
echo "2️⃣ 检查数据库连接..."
if docker exec blog_postgres pg_isready -U user -d personal_blog > /dev/null 2>&1; then
    echo "✅ 数据库连接正常"
else
    echo "❌ 数据库连接失败"
    exit 1
fi
echo ""

# 测试 3: 检查标签表
echo "3️⃣ 检查标签数据..."
TAG_COUNT=$(docker exec blog_postgres psql -U user -d personal_blog -t -c "SELECT COUNT(*) FROM tags;" | tr -d ' ')
if [ "$TAG_COUNT" -eq 6 ]; then
    echo "✅ 找到 6 个系统标签"
    docker exec blog_postgres psql -U user -d personal_blog -c "SELECT name, slug FROM tags ORDER BY name;"
else
    echo "❌ 标签数量不正确: $TAG_COUNT"
    exit 1
fi
echo ""

# 测试 4: 检查后端 API
echo "4️⃣ 检查后端 API..."
if curl -s http://localhost:3001/api/tags | grep -q "success"; then
    echo "✅ 后端 API 正常响应"
    echo "标签列表:"
    curl -s http://localhost:3001/api/tags | python3 -m json.tool | grep -E '"name"|"slug"' | head -12
else
    echo "❌ 后端 API 无响应"
    exit 1
fi
echo ""

# 测试 5: 检查前端
echo "5️⃣ 检查前端..."
if curl -s http://localhost:3000 | grep -q "Pixel Portfolio"; then
    echo "✅ 前端正常加载"
else
    echo "❌ 前端加载失败"
    exit 1
fi
echo ""

# 测试 6: 检查文章 API（带标签过滤）
echo "6️⃣ 检查文章标签过滤 API..."
if curl -s "http://localhost:3001/api/articles?tag=portfolio-card" | grep -q "success"; then
    echo "✅ 文章标签过滤 API 正常"
else
    echo "❌ 文章标签过滤 API 失败"
    exit 1
fi
echo ""

echo "================================"
echo "✅ 所有测试通过！"
echo ""
echo "📝 下一步:"
echo "1. 访问管理面板创建文章"
echo "2. 为文章添加 'portfolio-card' 标签"
echo "3. 访问 http://localhost:3000 查看效果"
echo ""
echo "🔗 有用的链接:"
echo "- 前端: http://localhost:3000"
echo "- 后端 API: http://localhost:3001/api"
echo "- 标签 API: http://localhost:3001/api/tags"
