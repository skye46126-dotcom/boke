<template>
  <Command
    v-model="open"
    v-model:searchTerm="query"
  >
    <!-- 快速导航 -->
    <div v-if="!query" class="px-2 pb-2">
      <h3 class="mb-1 px-2 text-xs font-semibold text-gh-text-muted">Quick Navigation</h3>
      <CommandItem
        v-for="nav in navigation"
        :key="nav.path"
        :value="nav.name"
        @select="navigateTo(nav.path)"
      >
        <component :is="nav.icon" class="mr-2 h-4 w-4" />
        <span>{{ nav.name }}</span>
      </CommandItem>
    </div>

    <!-- 搜索结果 -->
    <div v-if="query && filteredResults.length" class="px-2 pb-2">
      <h3 class="mb-1 px-2 text-xs font-semibold text-gh-text-muted">Articles</h3>
      <CommandItem
        v-for="article in filteredResults"
        :key="article.id"
        :value="article.title"
        @select="navigateTo(`/articles/${article.slug}`)"
      >
        <FileText class="mr-2 h-4 w-4" />
        <div class="flex flex-col">
          <span>{{ article.title }}</span>
          <span class="text-xs text-gh-text-muted">{{ formatDate(article.date) }}</span>
        </div>
      </CommandItem>
    </div>
  </Command>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMagicKeys } from '@vueuse/core'
import Fuse from 'fuse.js'
import { FileText, Home, Image, Bot } from 'lucide-vue-next'
import Command from '@/components/ui/command/Command.vue'
import CommandItem from '@/components/ui/command/CommandItem.vue'
import { getSearchableArticles } from '@/services/articleService'

const router = useRouter()
const open = ref(false)
const query = ref('')
const articles = ref([])
const filteredResults = ref([])

const navigation = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'All Articles', path: '/articles', icon: FileText },
  { name: 'Gallery', path: '/gallery', icon: Image },
  { name: 'Agent Feed', path: '/agent-feed', icon: Bot },
]

// 键盘快捷键 Cmd+K
const { Meta_K, Ctrl_K } = useMagicKeys()
watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1]) {
    open.value = true
  }
})

// 加载文章数据
onMounted(async () => {
  try {
    articles.value = await getSearchableArticles()
  } catch (error) {
    console.error('Failed to load searchable articles:', error)
    articles.value = []
  }
  
  // 初始化 Fuse
  const fuse = new Fuse(articles.value, {
    keys: ['title', 'content'],
    threshold: 0.3,
  })

  // 监听搜索查询
  watch(query, (newQuery) => {
    if (!newQuery) {
      filteredResults.value = []
      return
    }
    const results = fuse.search(newQuery)
    filteredResults.value = results.map(r => r.item)
  })
})

function navigateTo(path) {
  router.push(path)
  open.value = false
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
