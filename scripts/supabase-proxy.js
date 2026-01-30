/**
 * Cloudflare Worker: Supabase Reverse Proxy
 * 
 * 作用：利用 Cloudflare 边缘网络加速国内对 Supabase 的访问。
 * 配置：
 * 1. 在 Cloudflare 创建一个新的 Worker。
 * 2. 将此代码粘贴进去。
 * 3. 在你的前端项目中，将 VITE_SUPABASE_URL 替换为该 Worker 的 URL。
 */

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)

    // 替换为你真实的 Supabase 项目地址，例如: https://xyz.supabase.co
    // 你也可以通过环境变量来设置这个值
    const SUPABASE_URL = '你的_SUPABASE_项目地址_例如_https://xxxx.supabase.co'

    // 构建新的请求 URL
    const actualSupabaseUrl = SUPABASE_URL + url.pathname + url.search

    // 克隆原始请求头并调整
    const newHeaders = new Headers(request.headers)
    newHeaders.set('Origin', SUPABASE_URL)
    newHeaders.set('Referer', SUPABASE_URL)

    // 转发请求
    const modifiedRequest = new Request(actualSupabaseUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: 'follow'
    })

    try {
        const response = await fetch(modifiedRequest)

        // 克隆响应以修改 CORS 头（如果需要）
        const newResponseHeaders = new Headers(response.headers)
        newResponseHeaders.set('Access-Control-Allow-Origin', '*')

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newResponseHeaders
        })
    } catch (err) {
        return new Response('Proxy Error: ' + err.message, { status: 500 })
    }
}
