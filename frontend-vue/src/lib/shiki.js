import { codeToHtml } from 'shiki'

export async function highlightCode(code, lang = 'javascript') {
    try {
        return await codeToHtml(code, {
            lang,
            theme: 'github-dark'
        })
    } catch (err) {
        console.warn(`Failed to highlight ${lang} code:`, err)
        // Fallback to plain code block
        return `<pre class="shiki"><code>${code}</code></pre>`
    }
}

export async function processCodeBlocks(htmlContent) {
    // Parse HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const codeBlocks = doc.querySelectorAll('pre code')

    for (const codeBlock of codeBlocks) {
        const code = codeBlock.textContent
        const langClass = codeBlock.className.match(/language-(\w+)/)
        const lang = langClass ? langClass[1] : 'text'

        if (lang !== 'text') {
            const highlighted = await highlightCode(code, lang)
            const pre = codeBlock.parentElement
            pre.outerHTML = highlighted
        }
    }

    return doc.body.innerHTML
}
