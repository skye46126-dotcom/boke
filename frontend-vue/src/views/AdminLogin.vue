<template>
  <div class="login-shell">
    <div class="login-card">
      <p class="eyebrow">Admin Login</p>
      <h1>后台需要先认证再进入。</h1>
      <p class="description">
        后台现在只支持管理员密码登录，不再使用邮箱账号登录。
      </p>

      <div class="section" v-if="hasLocalAdminGate">
        <h2>Password Login</h2>
        <form class="form" @submit.prevent="handleLocalLogin">
          <label>
            <span>管理员口令</span>
            <input v-model="localPassword" type="password" placeholder="输入管理员口令" required />
          </label>
          <button type="submit">进入后台</button>
        </form>
        <p v-if="localAdminUsesConfiguredPassword" class="hint">当前使用 `.env` 中配置的本地管理员口令。</p>
        <p v-else-if="showDevHint" class="hint">当前开发模式默认口令：`admin`</p>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <router-link to="/" class="back-link">← 返回前台</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  loginWithLocalPassword,
  useAdminAuth,
} from '@/lib/adminAuth'

const route = useRoute()
const router = useRouter()
const localPassword = ref('')
const error = ref('')
const { hasLocalAdminGate, localAdminUsesConfiguredPassword } = useAdminAuth()

const showDevHint = computed(() => import.meta.env.DEV && hasLocalAdminGate.value)

function getRedirectPath() {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/admin')
    ? redirect
    : '/admin/writing-desk'
}

const handleLocalLogin = async () => {
  error.value = ''

  try {
    await loginWithLocalPassword(localPassword.value)
    router.replace(getRedirectPath())
  } catch (err) {
    error.value = err.message || '登录失败'
  }
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    radial-gradient(circle at top left, rgba(62, 175, 124, 0.12), transparent 24%),
    radial-gradient(circle at bottom right, rgba(88, 166, 255, 0.12), transparent 28%),
    var(--color-gh-bg);
}

.login-card {
  width: min(100%, 560px);
  padding: 2rem;
  border-radius: 28px;
  border: 1px solid var(--color-gh-border);
  background: rgba(22, 27, 34, 0.94);
}

.eyebrow {
  color: var(--color-vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

h1 {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
}

.description,
.hint,
.back-link {
  color: var(--color-gh-text-muted);
}

.section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gh-border);
}

.section h2 {
  color: var(--color-gh-text);
  font-weight: 600;
}

.form {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

label {
  display: grid;
  gap: 0.5rem;
}

span {
  color: var(--color-gh-text-muted);
}

input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-bg);
  color: var(--color-gh-text);
}

button {
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: var(--color-vp-c-brand);
  color: #04130b;
  font-weight: 700;
}

.error {
  margin-top: 1rem;
  color: #ff9494;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
}
</style>
