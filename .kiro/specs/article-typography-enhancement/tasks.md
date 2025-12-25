# Implementation Plan: Article Typography Enhancement

## Overview

实现高级文章排版系统和"微观动力"交互层，包含数学精确的基线网格、模块化字体比例、磁吸 UI 元素、动态标题动画和 Three.js 3D 签名图标。采用服务端内容预处理策略，最大化客户端性能。

## 架构说明

- **排版系统**：基于 28px 基线网格和 1.333 模块化比例
- **交互层**：RAF 驱动的磁吸效果和标题揭示动画
- **3D 图标**：Three.js 渲染的几何体，支持视口优化
- **富内容 API**：服务端 Markdown 预处理和结构化数据

## Tasks

- [ ] 1. 排版系统基础架构
  - [x] 1.1 创建 CSS 自定义属性系统
    - 定义基线网格变量（28px baseline）
    - 定义模块化比例变量（1.333 ratio）
    - 定义内容区域约束（720-800px）
    - 定义间距系统（baseline 倍数）
    - _Requirements: 1.1, 2.1, 2.3_

  - [x]* 1.2 为排版系统编写属性测试
    - **Property 1: Content Area Width Constraint**
    - **Property 2: Baseline Grid Alignment**
    - **Property 3: Modular Scale Typography**
    - **Validates: Requirements 1.1, 2.2, 2.4**

  - [x] 1.3 实现高级文本渲染优化
    - 启用字体连字（font-feature-settings）
    - 启用字距微调（text-rendering: optimizeLegibility）
    - 启用平滑抗锯齿（font-smoothing: antialiased）
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 1.4 设计学术风格引用块
    - 废弃传统左边框样式
    - 实现学术风格（斜体+缩进+引号背景）
    - 实现高亮风格（极淡背景色块）
    - _Requirements: 3.4, 3.5_

- [ ] 2. 富内容 API 系统
  - [x] 2.1 创建 Markdown 预处理器
    - 实现自定义语法解析（{.breakout}, {title="..."}）
    - 支持图片标题和布局提示
    - 生成结构化目录数据
    - 计算阅读时间
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 2.2 扩展 Article 数据模型
    - 创建 RichArticle 接口
    - 实现 generateRichContent 方法
    - 添加 htmlContent, tableOfContents, readingTime, contentImages 字段
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 2.3 创建富内容 API 端点
    - 实现 GET /api/articles/[slug]/rich
    - 返回预处理的 HTML 和结构化数据
    - 添加错误处理和降级策略
    - _Requirements: 7.5_

  - [x]* 2.4 为富内容 API 编写属性测试
    - **Property 9: API Rich Content Structure**
    - **Property 11: Custom Markdown Syntax Processing**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 8.1**

- [ ] 3. 微观动力交互系统
  - [x] 3.1 实现磁吸 UI 元素
    - 创建 MagneticElement 类
    - 实现光标跟踪和力场计算
    - 使用 requestAnimationFrame 平滑动画
    - 添加弹性缓动效果
    - _Requirements: 4.1, 4.2_

  - [x] 3.2 实现动态标题揭示
    - 创建 HeadingReveal 类
    - 使用 IntersectionObserver 检测进入视口
    - 实现光标闪烁和蒙版揭示动画
    - 确保动画时长 < 300ms
    - 每个标题仅触发一次
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 3.3 添加可访问性支持
    - 实现 prefers-reduced-motion 检测
    - 禁用所有动画当用户偏好静态
    - 保持键盘导航和焦点样式
    - _Requirements: 4.4, 4.5, 5.4, 10.2, 10.3_

  - [ ok]* 3.4 为微观动力编写属性测试
    - **Property 4: Magnetic UI Cursor Tracking**
    - **Property 5: Reduced Motion Compliance**
    - **Property 6: Heading Reveal Timing**
    - **Property 7: Heading Reveal Uniqueness**
    - **Property 12: Keyboard Navigation Preservation**
    - **Validates: Requirements 4.1, 4.4, 4.5, 5.1, 5.5, 10.2, 10.3**

- [-] 4. Three.js 签名图标
  - [x] 4.1 创建 SignatureIcon 组件
    - 初始化 Three.js 场景、相机、渲染器
    - 创建极简几何体（二十面体/环面/八面体）
    - 实现非匀速自转动画
    - 添加视口可见性检测
    - _Requirements: 6.1, 6.2_

  - [x] 4.2 实现性能优化
    - 使用 IntersectionObserver 监控可见性
    - 离开视口时停止 RAF 循环
    - 实现优雅的错误处理和降级
    - _Requirements: 6.4, 6.5_

  - [x] 4.3 为 Three.js 组件编写属性测试
    - **Property 8: Three.js Performance Optimization**
    - **Validates: Requirements 6.4**

- [ ] 5. 响应式布局系统
  - [x] 5.1 实现桌面端侧边栏布局
    - 目录和分享工具浮动在侧边
    - 内容区域居中，最大宽度约束
    - 大量留白创造聚焦效果
    - _Requirements: 1.3, 1.5_

  - [x] 5.2 实现移动端折叠布局
    - 目录收纳在主标题下的可点击按钮
    - 保持内容区域最优阅读宽度
    - 适配小屏幕的间距系统
    - _Requirements: 1.4_

  - [x] 5.3 实现破格布局支持
    - 支持图片和代码块突破内容区宽度
    - 实现 .breakout 和 .full-width 样式
    - 创造宽窄对比的视觉焦点
    - _Requirements: 3.6_

  - [x]* 5.4 为布局系统编写属性测试
    - **Property 10: Breakout Layout Width**
    - **Validates: Requirements 3.6**

- [ ] 6. 文章页面集成
  - [x] 6.1 更新文章详情页组件
    - 使用富内容 API 获取预处理数据
    - 集成排版系统和基线网格
    - 添加目录组件（响应式）
    - 渲染预处理的 HTML 内容
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 6.2 集成微观动力效果
    - 为链接和按钮添加磁吸效果
    - 为标题添加揭示动画
    - 在页脚添加 Three.js 签名图标
    - 确保所有效果支持可访问性
    - _Requirements: 4.1, 5.1, 6.1_

  - [x] 6.3 实现图片懒加载和占位符
    - 使用 native lazy loading
    - 集成 blurhash 占位符
    - 支持响应式图片源
    - 实现破格布局图片
    - _Requirements: 9.3_

- [x] 7. Checkpoint - 核心功能验证
  - 排版系统正确应用基线网格和模块化比例
  - 富内容 API 返回完整的结构化数据
  - 微观动力效果平滑运行且支持可访问性
  - Three.js 图标正常渲染且性能优化生效

- [x] 8. 性能优化和测试
  - [x] 8.1 实现客户端性能优化
    - 最小化 JavaScript 执行时间
    - 优化 RAF 循环和事件监听器
    - 实现代码分割和懒加载
    - 添加 CSS containment 优化
    - _Requirements: 9.1_

  - [x] 8.2 添加性能监控
    - 集成 Lighthouse 性能测试
    - 监控 Time to Interactive 指标
    - 测试 3G 网络下的加载时间
    - 验证 Three.js 帧率性能
    - _Requirements: 9.4, 9.5_

  - [x]* 8.3 编写集成测试
    - 测试完整文章页面渲染流程
    - 测试目录生成和滚动高亮
    - 测试图片懒加载和破格布局
    - 测试键盘导航通过磁吸元素
    - _Requirements: All_

- [x] 9. 可访问性和兼容性
  - [x] 9.1 实现完整的 a11y 支持
    - 测试键盘导航（Tab, Shift+Tab, Enter, Space）
    - 验证屏幕阅读器兼容性
    - 确保焦点样式清晰可见
    - 测试颜色对比度（WCAG AA）
    - _Requirements: 10.4, 10.5_

  - [x] 9.2 添加浏览器兼容性支持
    - 测试现代浏览器 ES2020+ 支持
    - 验证 CSS Grid 和自定义属性
    - 测试 IntersectionObserver API
    - 添加 WebGL 不支持时的降级
    - _Requirements: 6.3_

- [x] 10. 最终集成和部署准备
  - [x] 10.1 完整系统集成测试
    - 验证所有组件协同工作
    - 测试不同设备和屏幕尺寸
    - 验证性能指标达标
    - 确保可访问性合规
    - _Requirements: All_

  - [x] 10.2 生产环境优化
    - 配置 CDN 和静态资源缓存
    - 优化 Three.js 资源加载
    - 设置性能监控告警
    - 创建部署检查清单
    - _Requirements: 9.1, 9.4, 9.5_

## Notes

- **标记 `*` 的任务**：可选任务，可以跳过以加快 MVP 开发
- **属性测试**：使用 fast-check 库，最少 100 次迭代
- **Three.js 依赖**：需要安装 three@^0.160.0 和 @types/three
- **性能目标**：Lighthouse 分数 > 90，TTI < 2s (3G)
- **浏览器支持**：现代浏览器，ES2020+，WebGL 可选

## 依赖安装

```bash
# 核心依赖
npm install three@^0.160.0 marked@^11.0.0 blurhash@^2.0.5

# 开发依赖
npm install -D @types/three@^0.160.0 fast-check@^3.15.0

# 可选：性能测试
npm install -D lighthouse@^11.0.0
```

## 实现顺序建议

1. **Phase 1 (基础)**：Tasks 1.1, 1.3, 1.4 - 建立排版系统基础
2. **Phase 2 (API)**：Tasks 2.1, 2.2, 2.3 - 实现富内容预处理
3. **Phase 3 (交互)**：Tasks 3.1, 3.2, 3.3 - 添加微观动力效果
4. **Phase 4 (3D)**：Tasks 4.1, 4.2 - 集成 Three.js 签名图标
5. **Phase 5 (集成)**：Tasks 5.1, 5.2, 5.3, 6.1, 6.2, 6.3 - 完整页面集成
6. **Phase 6 (优化)**：Tasks 8.1, 8.2, 9.1, 9.2 - 性能和可访问性优化

每个阶段完成后建议运行 Checkpoint 验证，确保功能正常再进入下一阶段。