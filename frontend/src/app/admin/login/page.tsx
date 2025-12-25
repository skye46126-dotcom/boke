'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [adminPath, setAdminPath] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 验证 adminPath 是否有效
      const res = await fetch(`/api/manage/${adminPath}/stats`);
      
      if (!res.ok) {
        throw new Error('无效的管理路径');
      }

      // 保存到 localStorage
      localStorage.setItem('adminPath', adminPath);
      
      // 跳转到管理页面
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>管理后台登录</h1>
        <p className="login-description">
          请输入管理路径以访问后台
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="adminPath">管理路径</label>
            <input
              type="text"
              id="adminPath"
              value={adminPath}
              onChange={(e) => setAdminPath(e.target.value)}
              placeholder="例如: manage-panel-abc123"
              required
              className="form-input"
              disabled={loading}
            />
            <small className="form-hint">
              这是您在 .env.local 中配置的 ADMIN_PATH
            </small>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? '验证中...' : '进入管理后台'}
          </button>
        </form>
      </div>
    </div>
  );
}
