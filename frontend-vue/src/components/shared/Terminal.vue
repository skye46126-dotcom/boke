<template>
  <div class="terminal-container bg-gh-card border border-gh-border rounded-vp overflow-hidden shadow-vp-shadow-2">
    <!-- 终端头部 -->
    <div class="terminal-header bg-gh-bg px-4 py-2 border-b border-gh-border flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-green-500"></div>
      <span class="ml-2 text-sm text-gh-text-muted font-mono">zsh - interactive terminal</span>
    </div>
    
    <!-- 终端内容 -->
    <div class="terminal-body p-4 font-mono text-sm max-h-96 overflow-y-auto" ref="terminalBody">
      <!-- 历史命令 -->
      <div v-for="(line, index) in history" :key="index" class="mb-2">
        <div v-if="line.type === 'input'" class="text-vp-c-brand">
          <span class="text-gh-text-muted">$</span> {{ line.content }}
        </div>
        <div v-else :class="getOutputClass(line.style)" class="whitespace-pre-wrap">{{ line.content }}</div>
      </div>
      
      <!-- 当前输入 -->
      <div class="flex items-center">
        <span class="text-gh-text-muted mr-2">$</span>
        <input
          v-model="currentInput"
          @keyup.enter="handleCommand"
          @keyup.up="navigateHistory(-1)"
          @keyup.down="navigateHistory(1)"
          ref="terminalInput"
          class="flex-1 bg-transparent border-none outline-none text-gh-text font-mono"
          placeholder="输入 'help' 查看所有命令"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createCommands } from '@/utils/terminal/commands'
import { guessGame } from '@/utils/terminal/games'

const router = useRouter()
const route = useRoute()

// Initialize commands
const commands = createCommands(router, route)

const history = ref([
  { type: 'output', content: 'Welcome to my interactive terminal! 👨‍💻', style: 'success' },
  { type: 'output', content: 'Type "help" to see all available commands.\n', style: 'normal' }
])

const currentInput = ref('')
const terminalInput = ref(null)
const terminalBody = ref(null)

// 命令历史（用于↑↓导航）
const commandHistory = ref([])
const historyIndex = ref(-1)

const getOutputClass = (style) => {
  const classes = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return classes[style] || 'text-gh-text'
}

const handleCommand = () => {
  const input = currentInput.value.trim()
  if (!input) return
  
  // 保存到命令历史
  commandHistory.value.unshift(input)
  historyIndex.value = -1
  
  history.value.push({ type: 'input', content: input })
  
  // 猜数字游戏特殊处理
  if (guessGame.active && /^\d+$/.test(input)) {
    const output = guessGame.guess(input)
    history.value.push({ type: 'output', content: output + '\n', style: 'normal' })
    currentInput.value = ''
    scrollToBottom()
    return
  }
  
  if (input.toLowerCase() === 'exit' && guessGame.active) {
    const output = guessGame.exit()
    history.value.push({ type: 'output', content: output + '\n', style: 'normal' })
    currentInput.value = ''
    scrollToBottom()
    return
  }
  
  // 解析命令和参数
  const parts = input.split(' ')
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1).join(' ')
  
  if (commands[cmd]) {
    const output = commands[cmd](args)
    if (output === 'CLEAR') {
      history.value = []
    } else {
      history.value.push({ type: 'output', content: output + '\n', style: 'normal' })
    }
  } else if (input.trim() === '') {
     // do nothing
  } else {
    history.value.push({ 
      type: 'output', 
      content: `Command not found: ${cmd}\nType 'help' for available commands.\n`,
      style: 'error'
    })
  }
  
  currentInput.value = ''
  scrollToBottom()
}

const navigateHistory = (direction) => {
  if (commandHistory.value.length === 0) return
  
  const newIndex = historyIndex.value + direction
  if (newIndex < -1) {
    historyIndex.value = -1
    currentInput.value = ''
    return
  }
  if (newIndex >= commandHistory.value.length) {
    return
  }
  
  historyIndex.value = newIndex
  if (newIndex === -1) {
    currentInput.value = ''
  } else {
    currentInput.value = commandHistory.value[newIndex]
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

onMounted(() => {
  terminalInput.value?.focus()
})
</script>
