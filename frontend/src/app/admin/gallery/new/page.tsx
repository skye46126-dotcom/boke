'use client';

/**
 * Admin Gallery New - 新建作品页面
 * 
 * 功能：
 * 1. 拖入上传图片（react-dropzone）
 * 2. 相册集选择
 * 3. 表单提交创建作品
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { GalleryAlbum } from '@/types/gallery';

// 确保使用后端 API 地址
const API_URL = 'http://localhost:3001';

// ========================================
// 上传状态类型
// ========================================
type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

export default function NewGalleryItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 上传状态
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // 相册集列表
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    img_url: '',
    category: '',
    description: '',
    album_id: '',
  });

  // 加载相册集列表
  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch(`${API_URL}/api/gallery/albums`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setAlbums(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch albums:', err);
      }
    }
    fetchAlbums();
  }, []);

  // ========================================
  // 拖入上传逻辑
  // ========================================
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 本地预览
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadStatus('uploading');
    setUploadError(null);

    try {
      // 获取 admin path
      const adminPath = localStorage.getItem('adminPath');
      if (!adminPath) {
        throw new Error('未登录');
      }

      // 创建 FormData
      const uploadData = new FormData();
      uploadData.append('image', file);

      // 调用后端上传接口
      const res = await fetch(`/api/manage/${adminPath}/upload/image`, {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || '上传失败');
      }

      const data = await res.json();
      
      if (data.success && data.data?.url) {
        // 上传成功，更新表单
        setFormData(prev => ({ ...prev, img_url: data.data.url }));
        setUploadStatus('success');
        // 使用服务器返回的 URL 作为预览
        setPreviewUrl(data.data.url);
      } else {
        throw new Error('上传响应格式错误');
      }
    } catch (err) {
      setUploadStatus('error');
      setUploadError(err instanceof Error ? err.message : '上传失败');
      // 清除本地预览
      setPreviewUrl(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setUploadStatus('dragging'),
    onDragLeave: () => {
      if (uploadStatus === 'dragging') {
        setUploadStatus(formData.img_url ? 'success' : 'idle');
      }
    },
  });

  // ========================================
  // 表单提交
  // ========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.img_url || !formData.category) {
      setError('请填写标题、上传图片和分类');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('提交数据:', formData);
      
      // 直接使用后端地址，避免环境变量问题
      const apiUrl = 'http://localhost:3001';
      console.log('请求地址:', `${apiUrl}/api/gallery`);
      
      const submitData = {
        ...formData,
        album_id: formData.album_id || null,
      };
      
      const res = await fetch(`${apiUrl}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`服务器响应异常 (HTTP ${res.status})`);
      }
      
      if (!res.ok) {
        // 显示详细错误信息
        const errMsg = data.message || data.error || `HTTP ${res.status}`;
        console.error('创建失败详情:', data);
        throw new Error(errMsg);
      }
      
      router.push('/admin?tab=gallery');
    } catch (err) {
      let message = '创建失败';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        message = '网络连接失败，请检查后端服务是否运行';
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      console.error('创建作品错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 清除已上传图片
  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, img_url: '' }));
    setPreviewUrl(null);
    setUploadStatus('idle');
    setUploadError(null);
  };

  // ========================================
  // 渲染上传区域
  // ========================================
  const renderDropzone = () => {
    // 已上传成功状态
    if (uploadStatus === 'success' && previewUrl) {
      return (
        <div className="upload-preview">
          <img 
            src={previewUrl} 
            alt="预览" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '150px', 
              width: 'auto', 
              height: 'auto',
              display: 'block',
              objectFit: 'contain'
            }} 
          />
          <button type="button" className="clear-btn" onClick={handleClearImage}>
            ✕ 移除
          </button>
        </div>
      );
    }

    return (
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive || uploadStatus === 'dragging' ? 'dragging' : ''} ${uploadStatus === 'error' ? 'error' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploadStatus === 'uploading' ? (
          <div className="upload-loading">
            <div className="spinner" />
            <p>上传中...</p>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="upload-error">
            <p className="error-text">❌ {uploadError}</p>
            <p className="hint">点击或拖入重新上传</p>
          </div>
        ) : isDragActive || uploadStatus === 'dragging' ? (
          <div className="upload-dragging">
            <p>📥 松开鼠标上传图片</p>
          </div>
        ) : (
          <div className="upload-idle">
            <p>📷 拖入图片或点击选择</p>
            <p className="hint">支持 PNG、JPG、GIF、WebP，最大 10MB</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>新建作品</h1>
        <Link href="/admin?tab=gallery" className="btn btn-secondary">
          返回
        </Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>标题 *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="作品标题"
          />
        </div>

        {/* 拖入上传区域 */}
        <div className="form-group">
          <label>图片 *</label>
          {renderDropzone()}
          {/* 隐藏 input 存储 URL */}
          <input type="hidden" name="img_url" value={formData.img_url} />
        </div>

        <div className="form-group">
          <label>分类 *</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="风景 / 人物 / 建筑"
          />
        </div>

        <div className="form-group">
          <label>相册集</label>
          <select
            value={formData.album_id}
            onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
            className="album-select-input"
          >
            <option value="">未分组</option>
            {albums.map(album => (
              <option key={album.id} value={album.id}>{album.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>描述</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="作品描述（可选）"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading || !formData.img_url}>
            {loading ? '创建中...' : '创建作品'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .admin-form {
          max-width: 600px;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          padding: 24px;
          border-radius: 8px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          color: var(--color-text-primary);
          font-size: 14px;
          border-radius: 4px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        .form-group textarea {
          resize: vertical;
        }
        .form-actions {
          margin-top: 24px;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 12px;
          margin-bottom: 16px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 4px;
        }

        /* ========================================
         * 拖入上传区域样式
         * ======================================== */
        .dropzone {
          border: 2px dashed var(--color-border);
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--color-background);
        }
        
        .dropzone:hover {
          border-color: var(--color-accent);
          background: var(--color-surface-hover);
        }
        
        .dropzone.dragging {
          border-color: #22d3ee;
          background: rgba(34, 211, 238, 0.05);
          border-style: solid;
        }
        
        .dropzone.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .upload-idle p,
        .upload-dragging p {
          color: var(--color-text-primary);
          font-size: 15px;
          margin: 0;
        }
        
        .upload-idle .hint {
          color: var(--color-text-secondary);
          font-size: 13px;
          margin-top: 8px;
        }

        .upload-dragging p {
          color: #22d3ee;
          font-weight: 500;
        }

        /* 上传中 */
        .upload-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: #22d3ee;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .upload-loading p {
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* 上传错误 */
        .upload-error .error-text {
          color: #ef4444;
          font-weight: 500;
          margin: 0 0 8px;
        }
        
        .upload-error .hint {
          color: var(--color-text-secondary);
          font-size: 13px;
          margin: 0;
        }

        /* 上传成功预览 */
        .upload-preview {
          position: relative;
          display: inline-block;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          background: var(--color-background);
        }
        
        .upload-preview img {
          display: block;
          max-width: 200px !important;
          max-height: 150px !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
        }
        
        .clear-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.9);
        }

        /* 相册集选择器 */
        .album-select-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          color: var(--color-text-primary);
          font-size: 14px;
          border-radius: 4px;
          transition: border-color 0.2s;
        }
        
        .album-select-input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
      `}</style>
    </div>
  );
}
