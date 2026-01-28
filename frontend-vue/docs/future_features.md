# 未来功能扩展详细方案（基于一流项目实现）

> 本方案参考了 **Brittany Chiang Portfolio**、**VitePress**、**Stripe Docs** 等业界标杆项目的实现。

## 目录
1. [Cmd+K 搜索（shadcn-vue Command）](#1-cmdk-搜索shadcn-vue-command)
2. [Shiki 代码高亮 + Magic Move](#2-shiki-代码高亮--magic-move)
3. [Giscus 评论系统](#3-giscus-评论系统)
4. [VueUse 移动端手势](#4-vueuse-移动端手势)
5. [PWA 支持（vite-plugin-pwa）](#5-pwa-支持vite-plugin-pwa)
6. [阅读进度条（The Verge 风格）](#6-阅读进度条the-verge-风格)
7. [目录高亮跟随（Stripe  Docs 风格）](#7-目录高亮跟随stripe-docs-风格)

---

## 1. Cmd+K 搜索（shadcn-vue Command）

### 参考项目
- **shadcn-vue Command**: https://www.shadcn-vue.com/docs/components/command.html
- **Algolia DocSearch**: Vue/Vite 文档使用的搜索
- **Brittany Chiang Portfolio**: https://github.com/bchiang7/v4

### 为什么使用 shadcn-vue？
shadcn-vue 的 Command 组件是 Headless UI，提供：
- ✅ 开箱即用的 Cmd+K 快捷键
- ✅ 键盘导航（↑↓ 选择，Enter 执行）
- ✅ 模糊搜索
- ✅ 分组显示

### 完整实现步骤

#### Step 1: 安装 shadcn-vue Command

```bash
npx shadcn-vue@latest add command
npm install @vueuse/core
```

这会在 `src/components/ui/command` 下创建以下文件：
- Command.vue
- CommandDialog.vue
- CommandInput.vue
- CommandList.vue
- CommandItem.vue
- etc.

#### Step 2: 创建搜索对话框组件

```vue
<!-- src/components/SearchDialog.vue -->
<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="Search articles, tags, or type a command..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>

      <!-- 快速跳转 -->
      <CommandGroup heading="Quick Navigation">
        <CommandItem @select="navigateTo('/')">
          <Home class="mr-2 h-4 w-4" />
          <span>Home</span>
        </CommandItem>
        <CommandItem @select="navigateTo('/articles')">
          <FileText class="mr-2 h-4 w-4" />
          <span>All Articles</span>
        </CommandItem>
        <CommandItem @select="navigateTo('/gallery')">
          <Image class="mr-2 h-4 w-4" />
          <span>Gallery</span>
        </CommandItem>
      </CommandGroup>

      <!-- 文章搜索结果 -->
      <CommandGroup v-if="filteredArticles.length" heading="Articles">
        <CommandItem
          v-for="article in filteredArticles"
          :key="article.id"
          :value="article.title"
          @select="navigateTo(`/articles/${article.slug}`)"
        >
          <FileText class="mr-2 h-4 w-4" />
          <span>{{ article.title }}</span>
          <CommandShortcut>{{ formatDate(article.date) }}</CommandShortcut>
        </CommandItem>
      </CommandGroup>

      <!-- 标签过滤 -->
      <CommandGroup v-if="filteredTags.length" heading="Tags">
        <CommandItem
          v-for="tag in filteredTags"
          :key="tag"
          :value="tag"
          @select="filterByTag(tag)"
        >
          <Tag class="mr-2 h-4 w-4" />
          <span>{{ tag }}</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMagicKeys } from '@vueuse/core'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from '@/components/ui/command'
import { FileText, Home, Image, Tag } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const open = ref(false)
const articles = ref([])
const allTags = ref([])

// 使用 VueUse 监听 Cmd+K
const keys = useMagicKeys()
const cmdK = keys['Meta+K'] || keys['Ctrl+K']

watch(cmdK, (v) => {
  if (v) {
    open.value = true
  }
})

// 加载文章数据
onMounted(async () => {
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, date, tags')
    .eq('status', 'published')

  articles.value = data || []
  
  // 提取所有标签
  const tags = new Set()
  articles.value.forEach(a => {
    a.tags?.forEach(tag => tags.add(tag))
  })
  allTags.value = Array.from(tags)
})

// 搜索过滤（这里简化，实际可用 Fuse.js）
const filteredArticles = computed(() => {
  return articles.value.slice(0, 5) // 最多显示 5 篇
})

const filteredTags = computed(() => {
  return allTags.value.slice(0, 5)
})

function navigateTo(path) {
  router.push(path)
  open.value = false
}

function filterByTag(tag) {
  router.push(`/articles?tag=${tag}`)
  open.value = false
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
```

#### Step 3: 集成到 App.vue

```vue
<template>
  <SearchDialog />
  <router-view />
</template>

<script setup>
import SearchDialog from './components/SearchDialog.vue'
</script>
```

#### Step 4: 添加搜索图标提示

```vue
<!-- src/views/ArticleList.vue -->
<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-4">All Articles</h1>
    
    <!-- 搜索占位符 -->
    <button
      @click="openSearch"
      class="w-full max-w-xl px-4 py-2 bg-gh-card border border-gh-border rounded-vp text-left text-gh-text-muted flex items-center justify-between hover:border-vp-c-brand transition"
    >
      <span class="flex items-center gap-2">
        <Search class="w-4 h-4" />
        Search articles...
      </span>
      <kbd class="px-2 py-1 text-xs bg-gh-bg border border-gh-border rounded">⌘K</kbd>
    </button>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'

const openSearch = () => {
  const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
  window.dispatchEvent(event)
}
</script>
```

### 工作量估算
- **时间**：3-4 小时
- **难度**：中等

---

## 2. Shiki 代码高亮 + Magic Move

### 参考项目
- **VitePress**: https://github.com/vuejs/vitepress
- **Shiki Magic Move**: https://github.com/shikijs/shiki-magic-move
- **Anthony Fu's Blog**: https://antfu.me

### VitePress 的 Shiki 集成方式

VitePress 在构建时使用 Shiki 高亮代码，我们可以在运行时复用这个方案。

#### Step 1: 安装依赖

```bash
npm install shiki shiki-magic-move
```

#### Step 2: 创建 Shiki 服务

```javascript
// src/utils/shiki.js
import { getHighlighter } from 'shiki'

let highlighter = null

export async function initShiki() {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [
        'javascript',
        'typescript',
        'vue',
        'vue-html',
        'css',
        'scss',
        'html',
        'bash',
        'python',
        'sql',
        'json',
        'yaml',
        'markdown'
      ]
    })
  }
  return highlighter
}

export async function highlightCode(code, lang = 'javascript', theme = 'github-dark') {
  const h = await initShiki()
  return h.codeToHtml(code, {
    lang,
    theme,
    transformers: [
      // 添加行号
      {
        line(node, line) {
          node.properties['data-line'] = line
        }
      }
    ]
  })
}
```

#### Step 3: 代码块组件（带复制按钮）

```vue
<!-- src/components/CodeBlock.vue -->
<template>
  <div class="code-block-wrapper relative group my-4">
    <!-- 顶部工具栏 -->
    <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gh-bg/95 backdrop-blur border-b border-gh-border rounded-t-vp">
      <span class="text-xs text-gh-text-muted font-mono">{{ language }}</span>
      <button
        @click="copy Code"
        class="opacity-0 group-hover:opacity-100 transition px-2 py-1 text-xs bg-gh-card border border-gh-border rounded hover:border-vp-c-brand"
      >
        <Check v-if="copied" class="w-3 h-3" />
        <Copy v-else class="w-3 h-3" />
        <span class="ml-1">{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>

    <!-- 代码内容 -->
    <div class="pt-12">
      <div v-html="highlightedCode" class="shiki-wrapper"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { highlightCode } from '@/utils/shiki'

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  theme: { type: String, default: 'github-dark' }
})

const highlightedCode = ref('')
const copied = ref(false)

onMounted(async () => {
  highlightedCode.value = await highlightCode(props.code, props.language, props.theme)
})

async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style>
.shiki-wrapper {
  @apply rounded-b-vp overflow-x-auto;
}

.shiki-wrapper pre {
  @apply p-4 m-0 bg-gh-card;
}

.shiki-wrapper code {
  @apply font-mono text-sm leading-relaxed;
}

/* 行号样式 */
.shiki-wrapper [data-line]::before {
  @apply inline-block w-8 text-right mr-4 text-gh-text-muted select-none;
  content: attr(data-line);
}
</style>
```

#### Step 4: Magic Move 动画（进阶）

```vue
<!-- src/components/CodeMagicMove.vue -->
<template>
  <div class="code-magic-move">
    <ShikiMagicMove
      :code="currentCode"
      :lang="lang"
      :theme="theme"
      :options="{ duration: 300, stagger: 3 }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShikiMagicMove } from 'shiki-magic-move/vue'
import 'shiki-magic-move/dist/style.css'

const props = defineProps({
  steps: Array, // [{ code: '...', lang: 'js' }, ...]
  lang: { type: String, default: 'javascript' },
  theme: { type: String, default: 'github-dark' }
})

const currentStep = ref(0)
const currentCode = computed(() => props.steps[currentStep.value]?.code || '')

// 可以添加自动播放或手动切换逻辑
</script>
```

### 工作量估算
- **基础高亮**：4-5 小时
- **Magic Move**：2-3 小时（进阶）

---

## 3. Giscus 评论系统

### 官方网站
- https://giscus.app

### 为什么选择 Giscus？
- ✅ 基于 GitHub Discussions，"硬核"氛围
- ✅ 免费、开源、无广告
- ✅ 支持 Markdown + 代码高亮
- ✅ 支持点赞/回复

### 实现步骤

#### Step 1: 启用 GitHub Discussions

1. 进入你的 GitHub 仓库
2. Settings → Features → Discussions ✅

#### Step 2: 获取配置

访问 https://giscus.app，填写：
- 仓库：`your-username/your-repo`
- Discussion 分类：选择 "Announcements"
- 映射方式：`pathname`（推荐）

会生成如下配置：

```html
<script src="https://giscus.app/client.js"
        data-repo="your-username/your-repo"
        data-repo-id="R_kgDOxxxxxx"
        data-category="Announcements"
        data-category-id="DIC_kwDOxxxxxx"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="dark"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

#### Step 3: 安装 Vue 组件

```bash
npm install @giscus/vue
```

#### Step 4: 创建评论组件

```vue
<!-- src/components/Comments.vue -->
<template>
  <div class="comments-section mt-16 pt-8 border-t border-gh-border">
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <MessageSquare class="w-6 h-6" />
      Comments
    </h2>
    
    <Giscus
      :repo="config.repo"
      :repo-id="config.repoId"
      :category="config.category"
      :category-id="config.categoryId"
      mapping="pathname"
      :strict="0"
      :reactions-enabled="1"
      :emit-metadata="0"
      input-position="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="en"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Giscus from '@giscus/vue'
import { MessageSquare } from 'lucide-vue-next'
import { useDark } from '@vueuse/core'

const isDark = useDark()

const config = {
  repo: 'your-username/your-repo',
  repoId: 'R_kgDOxxxxxx',
  category: 'Announcements',
  categoryId: 'DIC_kwDOxxxxxx',
}
</script>

<style>
/* Giscus 主题自定义 */
.giscus {
  @apply w-full;
}

.giscus-frame {
  @apply rounded-vp border border-gh-border;
}
</style>
```

#### Step 5: 集成到文章详情页

```vue
<!-- src/views/ArticleDetail.vue -->
<template>
  <div class="article-container">
    <article>
      <!-- 文章内容 -->
    </article>
    
    <!-- 评论区 -->
    <Comments />
  </div>
</template>

<script setup>
import Comments from '@/components/Comments.vue'
</script>
```

### 工作量估算
- **时间**：1-2 小时
- **难度**：简单

---

## 4. VueUse 移动端手势

### 参考资源
- **VueUse 文档**: https://vueuse.org/core/useSwipe/
- **iOS Safari**: 参考原生滑动返回手势

### 实现步骤

#### Step 1: 安装 VueUse

```bash
npm install @vueuse/core
```

#### Step 2: 文章左右滑动切换

```vue
<!-- src/views/ArticleDetail.vue -->
<template>
  <div ref="target" class="article-container">
    <!-- 文章内容 -->
    <article>...</article>
    
    <!-- 滑动提示（仅移动端） -->
    <Transition name="fade">
      <div v-if="showHint && isMobile" class="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gh-card border border-gh-border rounded-vp text-sm text-gh-text-muted">
        <span v-if="direction === 'left'">← Swipe for next article</span>
        <span v-else>Swipe for previous article →</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSwipe, useBreakpoints } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()
const target = ref(null)
const showHint = ref(false)
const direction = ref('')

const breakpoints = useBreakpoints({
  mobile: 768,
})
const isMobile = breakpoints.smaller('mobile')

const { direction: swipeDirection, isSwiping } = useSwipe(target, {
  threshold: 50, // 至少滑动 50px
  passive: false,
  onSwipe(e) {
    if (e.direction === 'left') {
      direction.value = 'left'
      showHint.value = true
    } else if (e.direction === 'right') {
      direction.value = 'right'
      showHint.value = true
    }
    
    setTimeout(() => showHint.value = false, 1500)
  },
  onSwipeEnd(e) {
    if (e.direction === 'left') {
      loadNextArticle()
    } else if (e.direction === 'right') {
      loadPrevArticle()
    }
  }
})

async function loadNextArticle() {
  // 获取下一篇文章逻辑
  const { data } = await supabase
    .from('articles')
    .select('slug')
    .gt('date', currentArticle.value.date)
    .order('date', { ascending: true })
    .limit(1)
    .single()

  if (data) {
    router.push(`/articles/${data.slug}`)
  }
}

async function loadPrevArticle() {
  // 获取上一篇文章逻辑
  const { data } = await supabase
    .from('articles')
    .select('slug')
    .lt('date', currentArticle.value.date)
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (data) {
    router.push(`/articles/${data.slug}`)
  }
}
</script>
```

#### Step 3: Gallery 图片捏合缩放

```vue
<!-- src/views/Gallery.vue -->
<template>
  <div
    v-for="image in images"
    :key="image.id"
    ref="imageRefs"
    @dblclick="openModal(image)"
    class="gallery-item"
  >
    <img :src="image.url" />
  </div>

  <!-- 模态框支持捏合 -->
  <Teleport to="body">
    <div v-if="selectedImage" ref="modalRef" class="modal">
      <img
        ref="zoomImage"
        :src="selectedImage.url"
        :style="{ transform: `scale(${scale})` }"
        class="transition-transform"
      />
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useGesture } from '@vueuse/gesture'

const selectedImage = ref(null)
const scale = ref(1)
const zoomImage = ref(null)

// 捏合缩放
useGesture({
  onPinch: ({ offset: [d] }) => {
    scale.value = 1 + d / 200
  }
}, {
  domTarget: zoomImage,
  eventOptions: { passive: false }
})
</script>
```

### 工作量估算
- **时间**：3-4 小时
- **难度**：中等

---

## 5. PWA 支持（vite-plugin-pwa）

### 参考项目
- **Squoosh**: https://squoosh.app （Google PWA 标杆）
- **vite-plugin-pwa 文档**: https://vite-pwa-org.netlify.app/

### 实现步骤

#### Step 1: 安装插件

```bash
npm install vite-plugin-pwa -D
```

#### Step 2: 配置 Vite

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['avater.jpeg', 'robots.txt'],
      manifest: {
        name: 'Your Developer Blog',
        short_name: 'Blog',
        description: 'A modern developer blog with GitHub style',
        theme_color: '#0d1117',
        background_color: '#0d1117',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Workbox 缓存策略（参考 Squoosh）
        runtimeCaching: [
          // Supabase API
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // 图片
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          // 字体
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ]
}
```

#### Step 3: 创建安装提示

```vue
<!-- src/components/PWAInstallPrompt.vue -->
<template>
  <Transition name="slide-up">
    <div
      v-if="showPrompt"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gh-card border border-gh-border rounded-vp shadow-vp-shadow-2 p-4 z-50"
    >
      <div class="flex items-start gap-3">
        <Download class="w-5 h-5 text-vp-c-brand shrink-0 mt-0.5" />
        <div class="flex-1">
          <h3 class="font-semibold mb-1">Install App</h3>
          <p class="text-sm text-gh-text-muted mb-3">
            Add this blog to your home screen for offline access and a better experience.
          </p>
          <div class="flex gap-2">
            <button
              @click="install"
              class="flex-1 px-3 py-2 bg-vp-c-brand text-white text-sm rounded-vp hover:bg-vp-c-brand-light transition"
            >
              Install
            </button>
            <button
              @click="dismiss"
              class="px-3 py-2 bg-gh-bg border border-gh-border text-sm rounded-vp hover:border-vp-c-brand transition"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download } from 'lucide-vue-next'

const showPrompt = ref(false)
let deferredPrompt = null

onMounted(() => {
  // 检查是否已安装
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return // 已安装，不显示提示
  }

  // 检查是否已拒绝
  const dismissed = localStorage.getItem('pwa-prompt-dismissed')
  if (dismissed && Date.now() - dismissed < 7 * 24 * 60 * 60 * 1000) {
    return // 7 天内拒绝过
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    localStorage.removeItem('pwa-prompt-dismissed')
  })
})

async function install() {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    showPrompt.value = false
  }

  deferredPrompt = null
}

function dismiss() {
  showPrompt.value = false
  localStorage.setItem('pwa-prompt-dismissed', Date.now())
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
```

### 工作量估算
- **时间**：2-3 小时
- **难度**：简单

---

## 6. 阅读进度条（The Verge 风格）

### 参考网站
- **The Verge**: https://www.theverge.com （顶部细进度条）

### 实现（超简单）

```vue
<!-- src/components/ReadingProgress.vue -->
<template>
  <div class="fixed top-0 left-0 right-0 h-0.5 bg-gh-border z-50">
    <div
      :style="{ width: `${progress}%` }"
      class="h-full bg-linear-to-r from-vp-c-brand via-vp-c-brand-light to-poker-club transition-all duration-150"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThrottleFn } from '@vueuse/core'

const progress = ref(0)

const updateProgress = useThrottleFn(() => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = Math.min((scrollTop / docHeight) * 100, 100)
}, 100)

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>
```

使用：

```vue
<!-- src/views/ArticleDetail.vue -->
<template>
  <ReadingProgress />
  <article>...</article>
</template>
```

### 工作量估算
- **时间**：30 分钟
- **难度**：简单

---

## 7. 目录高亮跟随（Stripe Docs 风格）

### 参考网站
- **Stripe Docs**: https://stripe.com/docs （右侧目录 + 滑块指示器）

### 完整实现（带滑块动画）

```vue
<!-- src/components/TableOfContents.vue -->
<template>
  <nav class="toc sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
    <div class="text-sm font-semibold text-gh-text mb-3">On this page</div>
    
    <!-- 滑块指示器（Stripe 风格） -->
    <div class="relative">
      <div
        :style="{ top: `${indicatorTop}px`, height: `${indicatorHeight}px` }"
        class="absolute left-0 w-0.5 bg-vp-c-brand transition-all duration-300"
      ></div>
      
      <ul class="space-y-2 border-l-2 border-gh-border pl-4">
        <li v-for="(heading, index) in headings" :key="heading.id">
          <a
            :ref="el => linkRefs[index] = el"
            :href="`#${heading.id}`"
            :class="[
              'block text-sm transition-colors py-1',
              activeId === heading.id 
                ? 'text-vp-c-brand font-medium' 
                : 'text-gh-text-muted hover:text-vp-c-brand',
              heading.level === 3 && 'ml-3'
            ]"
            @click.prevent="scrollToHeading(heading.id)"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  headings: Array
})

const activeId = ref('')
const linkRefs = ref([])
const indicatorTop = ref(0)
const indicatorHeight = ref(0)

let observer = null

onMounted(() => {
  const headingElements = props.headings
    .map(h => document.getElementById(h.id))
    .filter(Boolean)

  observer = new IntersectionObserver(
    (entries) => {
      // 找到最近的可见标题
      const visibleEntries = entries.filter(e => e.isIntersecting)
      if (visibleEntries.length) {
        const topEntry = visibleEntries.reduce((top, entry) => 
          entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
        )
        activeId.value = topEntry.target.id
      }
    },
    {
      rootMargin: '-80px 0px -80% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
  )

  headingElements.forEach(el => observer.observe(el))
})

// 更新滑块位置
watch(activeId, () => {
  const activeIndex = props.headings.findIndex(h => h.id === activeId.value)
  if (activeIndex !== -1 && linkRefs.value[activeIndex]) {
    const linkEl = linkRefs.value[activeIndex]
    indicatorTop.value = linkEl.offsetTop
    indicatorHeight.value = linkEl.offsetHeight
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function scrollToHeading(id) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80
    const top = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    activeId.value = id
  }
}
</script>

<style scoped>
.toc::-webkit-scrollbar {
  width: 4px;
}

.toc::-webkit-scrollbar-thumb {
  @apply bg-gh-border rounded-full;
}
</style>
```

### 工作量估算
- **时间**：2-3 小时
- **难度**：中等

---

## 总工作量估算（更新）

| 功能 | 时间 | 难度 | 优先级 | 参考项目 |
|------|------|------|--------|----------|
| Cmd+K 搜索 | 3-4h | 中 | 🔥高 | shadcn-vue, Algolia |
| Shiki 高亮 | 4-5h | 中高 | 中 | VitePress |
| Magic Move | 2-3h | 高 | 低 | Slidev, Anthony Fu |
| Giscus 评论 | 1-2h | 低 | 🔥高 | Giscus.app |
| 移动端手势 | 3-4h | 中 | 中 | VueUse |
| PWA 支持 | 2-3h | 低 | 中 | Squoosh |
| 阅读进度条 | 0.5h | 低 | 低 | The Verge |
| 目录高亮 | 2-3h | 中 | 🔥高 | Stripe Docs |

**推荐实施顺序**（基于性价比）：
1. **阅读进度条 + 目录高亮**（2.5-3.5h）→ 快速提升阅读体验
2. **Giscus 评论**（1-2h）→ 增强互动，硬核氛围
3. **Cmd+K 搜索**（3-4h）→ 大幅提升可用性
4. **PWA 支持**（2-3h）→ 提升留存，离线访问
5. **Shiki 高亮**（4-5h）→ 提升专业度
6. **移动端手势**（3-4h）→ 优化移动体验
7. **Magic Move**（2-3h）→ 炫酷加分项

**总计**：18-26.5 小时（约 2.5-3.5 天）

---

## 关键资源汇总

### 📚 必读文档
1. **shadcn-vue**: https://www.shadcn-vue.com/docs/components/command
2. **VueUse**: https://vueuse.org
3. **Shiki**: https://shiki.style
4. **Giscus**: https://giscus.app
5. **vite-plugin-pwa**: https://vite-pwa-org.netlify.app

### 🎨 设计参考
1. **Brittany Chiang Portfolio**: https://brittanychiang.com
2. **Stripe Docs**: https://stripe.com/docs
3. **The Verge**: https://www.theverge.com
4. **Anthony Fu's Blog**: https://antfu.me
5. **Squoosh**: https://squoosh.app

### 💻 代码仓库
1. **Brittany Chiang v4**: https://github.com/bchiang7/v4
2. **VitePress**: https://github.com/vuejs/vitepress
3. **Shiki Magic Move**: https://github.com/shikijs/shiki-magic-move
