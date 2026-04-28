import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const loadDefault = (loader) => () => loader().then((module) => module.default)

const SUPPORTED_LANGS = new Set([
    'bash',
    'css',
    'diff',
    'html',
    'javascript',
    'json',
    'jsx',
    'markdown',
    'shellscript',
    'sql',
    'tsx',
    'typescript',
    'vue',
    'yaml',
])

const LANG_ALIASES = {
    cjs: 'javascript',
    js: 'javascript',
    mjs: 'javascript',
    md: 'markdown',
    sh: 'bash',
    shell: 'shellscript',
    ts: 'typescript',
    yml: 'yaml',
}

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export function normalizeCodeLanguage(lang = 'text') {
    const normalized = LANG_ALIASES[String(lang).toLowerCase()] || String(lang).toLowerCase()
    return SUPPORTED_LANGS.has(normalized) ? normalized : 'text'
}

let highlighterPromise

export function getAppHighlighter() {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighterCore({
            themes: [
                loadDefault(() => import('@shikijs/themes/github-dark')),
                loadDefault(() => import('@shikijs/themes/dark-plus')),
            ],
            langs: [
                loadDefault(() => import('@shikijs/langs/bash')),
                loadDefault(() => import('@shikijs/langs/css')),
                loadDefault(() => import('@shikijs/langs/diff')),
                loadDefault(() => import('@shikijs/langs/html')),
                loadDefault(() => import('@shikijs/langs/javascript')),
                loadDefault(() => import('@shikijs/langs/json')),
                loadDefault(() => import('@shikijs/langs/jsx')),
                loadDefault(() => import('@shikijs/langs/markdown')),
                loadDefault(() => import('@shikijs/langs/shellscript')),
                loadDefault(() => import('@shikijs/langs/sql')),
                loadDefault(() => import('@shikijs/langs/tsx')),
                loadDefault(() => import('@shikijs/langs/typescript')),
                loadDefault(() => import('@shikijs/langs/vue')),
                loadDefault(() => import('@shikijs/langs/yaml')),
            ],
            engine: createJavaScriptRegexEngine(),
        })
    }

    return highlighterPromise
}

export async function highlightCode(code, lang = 'javascript', theme = 'github-dark') {
    const normalizedLang = normalizeCodeLanguage(lang)

    if (normalizedLang === 'text') {
        return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
    }

    try {
        const highlighter = await getAppHighlighter()
        return highlighter.codeToHtml(code, {
            lang: normalizedLang,
            theme
        })
    } catch (err) {
        console.warn(`Failed to highlight ${lang} code:`, err)
        return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
    }
}

export async function processCodeBlocks(htmlContent) {
    // Parse HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const codeBlocks = doc.querySelectorAll('pre code')

    for (const codeBlock of codeBlocks) {
        const code = codeBlock.textContent
        const langClass = codeBlock.className.match(/language-([\w-]+)/)
        const lang = langClass ? langClass[1] : 'text'

        if (normalizeCodeLanguage(lang) !== 'text') {
            const highlighted = await highlightCode(code, lang)
            const pre = codeBlock.parentElement
            pre.outerHTML = highlighted
        }
    }

    return doc.body.innerHTML
}
