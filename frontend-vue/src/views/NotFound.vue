<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">404</div>
      <h1 class="title">Page Not Found</h1>
      <p class="description">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      
      <div class="actions">
        <button @click="goHome" class="btn-primary">
          ← 回到首页
        </button>
        <button @click="goBack" class="btn-secondary">
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gh-bg);
  padding: 2rem;
  position: relative;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.content {
  max-width: 500px;
  text-align: center;
  z-index: 1;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00dc82, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
  animation: slideDown 0.8s ease-out 0.2s both;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gh-text);
  margin-bottom: 1rem;
  animation: slideDown 0.8s ease-out 0.3s both;
}

.description {
  font-size: 1.125rem;
  color: var(--color-gh-text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
  animation: slideDown 0.8s ease-out 0.4s both;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: slideDown 0.8s ease-out 0.5s both;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #00dc82, #3eaf7c);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 220, 130, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-gh-text);
  border: 1px solid var(--color-gh-border);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-vp-c-brand);
  transform: translateY(-2px);
}

/* Mobile */
@media (max-width: 640px) {
  .error-code {
    font-size: 5rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .description {
    font-size: 1rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
