<template>
  <div class="flex-1 flex flex-col overflow-hidden h-full">
    <div v-if="!activeTab" class="flex-1 flex flex-col items-center justify-center text-gray-600 select-none">
       <div class="text-4xl mb-4 opacity-20">⌨</div>
       <p>Select a file to start editing</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto font-mono text-sm relative custom-scrollbar pb-20" :key="activeTab.id">
        <div class="flex min-h-full">
           <!-- Line Numbers -->
           <div class="w-12 text-right pr-4 text-gray-600 text-xs select-none bg-[#1e1e1e] shrink-0 pt-4">
              <div v-for="n in lineCount" :key="n" class="leading-6 h-6">{{ n }}</div>
           </div>
           
           <!-- Code Content (Shiki) -->
           <div class="flex-1 pt-4 pr-4">
              <div v-if="!highlightedCode" class="text-gray-500 animate-pulse">Loading highlight...</div>
              <div v-else v-html="highlightedCode" class="shiki-code relative"></div>
              <!-- Blinking Cursor (Simulated at end) -->
              <div class="inline-block w-2.5 h-5 bg-white/80 animate-blink ml-0.5 align-middle"></div>
           </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { createHighlighter } from 'shiki'

const props = defineProps({
  activeTab: Object
})

const emit = defineEmits(['update-line-count'])

const highlightedCode = ref('')
const lineCount = ref(1)
let highlighter = null

onMounted(async () => {
  highlighter = await createHighlighter({
    themes: ['dark-plus'],
    langs: ['javascript', 'json', 'markdown', 'bash']
  })
  if (props.activeTab) updateHighlight()
})

const formatVarName = (name) => name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')

const generateContent = (tab) => {
   const proj = tab.project
   if (tab.type === 'js') {
     return `import { ${proj.technologies.slice(0,3).join(', ')} } from 'libs';

// ${proj.description}
export const ${formatVarName(proj.title)} = () => {
  console.log('Project initialized!');
  
  return (
    <div className="awesome-project">
      {/* TODO: Build something amazing */}
      <h1>${proj.title}</h1>
      <p>Powered by ${proj.technologies[0]}</p>
    </div>
  );
}`
   } else if (tab.type === 'json') {
     return JSON.stringify({
       name: proj.title.replace(/\s+/g, '-').toLowerCase(),
       version: "1.0.0",
       private: true,
       dependencies: proj.technologies.reduce((acc, t) => ({...acc, [t.toLowerCase()]: "^latest"}), {}),
       scripts: { dev: "vite", build: "vite build" }
     }, null, 2)
   } else if (tab.type === 'md') {
     return `# ${proj.title} ${proj.emoji}

> ${proj.description}

## Features
- Built with ${proj.technologies.join(' + ')}
- High performance
- Responsive design

${proj.demo ? `[Try Demo](${proj.demo})` : ''}
${proj.github ? `[View Source](${proj.github})` : ''}
`
   }
   return ''
}

const updateHighlight = async () => {
  if (!props.activeTab || !highlighter) return
  
  const code = generateContent(props.activeTab)
  const lang = props.activeTab.type === 'js' ? 'javascript' : props.activeTab.type === 'md' ? 'markdown' : 'json'
  
  highlightedCode.value = highlighter.codeToHtml(code, {
    lang,
    theme: 'dark-plus'
  })
  
  const lines = code.split('\n').length
  lineCount.value = lines
  emit('update-line-count', lines)
}

watch(() => props.activeTab, updateHighlight, { deep: true })
</script>

<style scoped>
/* Shiki Overrides */
:deep(.shiki) {
  background-color: transparent !important;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
}

:deep(pre) {
    font-family: inherit;
    margin: 0;
}

:deep(.shiki code) {
    display: block;
    width: max-content;
}

/* Line height matching */
.leading-6 {
    line-height: 1.5rem; /* 24px */
}
:deep(.shiki .line) {
    line-height: 1.5rem; /* Match line numbers */
    display: inline-block;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #1e1e1e; }
::-webkit-scrollbar-thumb { background: #424242; }
::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }
</style>
