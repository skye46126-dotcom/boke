<template>
  <div class="admin-bar">
    <div class="admin-meta">
      <p class="eyebrow">Admin Access</p>
      <p class="description">
        <span v-if="adminState.method === 'supabase'">
          Signed in as {{ adminState.user?.email }}
        </span>
        <span v-else-if="adminState.method === 'local'">
          Local admin session is active
        </span>
      </p>
    </div>
    <div class="actions">
      <router-link to="/admin/writing-desk" class="action-link">Writing Desk</router-link>
      <router-link to="/admin/agent-console" class="action-link">Agent Console</router-link>
      <router-link to="/" class="action-link">Public Site</router-link>
      <button type="button" class="logout-button" @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logoutAdmin, useAdminAuth } from '@/lib/adminAuth'

const router = useRouter()
const { adminState } = useAdminAuth()

const handleLogout = async () => {
  await logoutAdmin()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-gh-border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 1rem;
}

.eyebrow {
  color: var(--color-vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

.description {
  margin-top: 0.3rem;
  color: var(--color-gh-text-muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-link,
.logout-button {
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text);
}

@media (max-width: 768px) {
  .admin-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
