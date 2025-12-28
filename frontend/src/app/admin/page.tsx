'use client';

/**
 * Admin Dashboard - 管理后台
 * 
 * 功能模块：
 * 1. 顶部标签页 - 文章管理 / 相册管理 切换
 * 2. 统计区域 - 带颜色区分和进度条
 * 3. 列表管理 - 筛选、排序、操作
 * 4. 相册集管理 - 快速创建、批量归属
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { Article, ApiResponse } from '@/types/article';
import { GalleryItem, GalleryAlbum } from '@/types/gallery';
import ThemeToggle from '@/components/ThemeToggle';

// ========================================
// 上传文件类型
// ========================================
interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

// ========================================
// 类型定义
// ========================================

type TabType = 'articles' | 'gallery';
type SortField = 'created_at' | 'updated_at';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'published' | 'draft';

interface ArticleStats {
  total: number;
  published: number;
  draft: number;
}

interface GalleryStats {
  total: number;
  public: number;
  private: number;
  albumCount: number;
}

// ========================================
// 主组件
// ========================================

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [adminPath, setAdminPath] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 标签页状态 - 支持 URL 参数
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<TabType>(
    tabParam === 'gallery' ? 'gallery' : 'articles'
  );

  // 文章数据
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleStats, setArticleStats] = useState<ArticleStats>({ total: 0, published: 0, draft: 0 });

  // 相册数据
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryStats, setGalleryStats] = useState<GalleryStats>({ total: 0, public: 0, private: 0, albumCount: 0 });
  
  // 相册集数据
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [albumFilter, setAlbumFilter] = useState<string>('all');
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [batchAlbumId, setBatchAlbumId] = useState<string>('');
  
  // 批量上传状态
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 长廊配置状态
  const [showShowcaseModal, setShowShowcaseModal] = useState(false);
  const [showcaseItems, setShowcaseItems] = useState<GalleryItem[]>([]);
  const [showcaseSearch, setShowcaseSearch] = useState('');
  const [showcaseSelected, setShowcaseSelected] = useState<Set<string>>(new Set());

  // 筛选排序状态
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // ========================================
  // 数据获取
  // ========================================

  useEffect(() => {
    const savedAdminPath = localStorage.getItem('adminPath');
    if (!savedAdminPath) {
      router.push('/admin/login');
      return;
    }
    setAdminPath(savedAdminPath);
    fetchArticleData(savedAdminPath);
    fetchGalleryData();
    fetchAlbums();
  }, [router]);

  const fetchArticleData = async (path: string) => {
    try {
      setLoading(true);
      
      const articlesRes = await fetch(`/api/manage/${path}/articles`);
      if (!articlesRes.ok) throw new Error('Failed to fetch articles');
      const articlesData: ApiResponse<Article[]> = await articlesRes.json();
      setArticles(articlesData.data);

      const statsRes = await fetch(`/api/manage/${path}/stats`);
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      const statsData: ApiResponse<ArticleStats> = await statsRes.json();
      setArticleStats(statsData.data);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryData = async () => {
    try {
      // 直接使用后端地址
      const res = await fetch('http://localhost:3001/api/gallery?limit=100');
      if (!res.ok) throw new Error('Failed to fetch gallery');
      const data = await res.json();
      if (data.success) {
        setGalleryItems(data.data.items);
        // 计算统计
        const items = data.data.items;
        const albumRes = await fetch('http://localhost:3001/api/gallery/albums');
        const albumData = await albumRes.json();
        setGalleryStats({
          total: items.length,
          public: items.length,
          private: 0,
          albumCount: albumData.success ? albumData.data.length : 0,
        });
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/gallery/albums');
      if (!res.ok) throw new Error('Failed to fetch albums');
      const data = await res.json();
      if (data.success) {
        setAlbums(data.data);
      }
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  };

  // ========================================
  // 操作处理
  // ========================================

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    try {
      const res = await fetch(`/api/manage/${adminPath}/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete article');
      fetchArticleData(adminPath);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('确定要删除这个作品吗？')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete gallery item');
      fetchGalleryData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete gallery item');
    }
  };

  // 创建相册集（带批量上传）
  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) {
      alert('请输入相册集名称');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 1. 创建相册集
      const albumRes = await fetch('http://localhost:3001/api/gallery/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newAlbumName.trim(),
          description: newAlbumDescription.trim() || null,
        }),
      });
      if (!albumRes.ok) throw new Error('创建相册集失败');
      const albumData = await albumRes.json();
      const albumId = albumData.data.id;
      
      // 2. 上传所有待上传的图片
      const successfulUploads: string[] = [];
      const totalFiles = uploadFiles.filter(f => f.status === 'pending' || f.status === 'success').length;
      let completedFiles = 0;
      
      for (const uploadFile of uploadFiles) {
        if (uploadFile.status === 'success' && uploadFile.url) {
          // 已上传成功的，直接创建 gallery item
          try {
            await fetch('http://localhost:3001/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: uploadFile.file.name.replace(/\.[^/.]+$/, ''),
                img_url: uploadFile.url,
                category: '相册',
                album_id: albumId,
              }),
            });
            successfulUploads.push(uploadFile.id);
          } catch (err) {
            console.error('创建图片记录失败:', err);
          }
        } else if (uploadFile.status === 'pending') {
          // 待上传的，先上传再创建
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
          ));
          
          try {
            const adminPath = localStorage.getItem('adminPath');
            if (!adminPath) throw new Error('未登录');
            
            const formData = new FormData();
            formData.append('image', uploadFile.file);
            
            const uploadRes = await fetch(`/api/manage/${adminPath}/upload/image`, {
              method: 'POST',
              body: formData,
            });
            
            if (!uploadRes.ok) throw new Error('上传失败');
            const uploadData = await uploadRes.json();
            
            if (uploadData.success && uploadData.data?.url) {
              // 创建 gallery item
              await fetch('http://localhost:3001/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: uploadFile.file.name.replace(/\.[^/.]+$/, ''),
                  img_url: uploadData.data.url,
                  category: '相册',
                  album_id: albumId,
                }),
              });
              
              setUploadFiles(prev => prev.map(f => 
                f.id === uploadFile.id ? { ...f, status: 'success' as const, url: uploadData.data.url } : f
              ));
              successfulUploads.push(uploadFile.id);
            }
          } catch (err) {
            setUploadFiles(prev => prev.map(f => 
              f.id === uploadFile.id ? { ...f, status: 'error' as const, error: err instanceof Error ? err.message : '上传失败' } : f
            ));
          }
        }
        
        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
      }
      
      // 3. 完成
      setNewAlbumName('');
      setNewAlbumDescription('');
      setUploadFiles([]);
      setShowAlbumModal(false);
      setUploadProgress(0);
      fetchAlbums();
      fetchGalleryData();
      
      if (successfulUploads.length > 0) {
        alert(`相册集创建成功！已添加 ${successfulUploads.length} 张照片`);
      } else {
        alert('相册集创建成功！');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '创建失败');
    } finally {
      setIsUploading(false);
    }
  };
  
  // 拖拽上传处理
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // 处理被拒绝的文件
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(f => {
        const error = f.errors[0];
        if (error.code === 'file-too-large') return `${f.file.name}: 文件超过5MB`;
        if (error.code === 'file-invalid-type') return `${f.file.name}: 不支持的格式`;
        return `${f.file.name}: ${error.message}`;
      });
      alert('部分文件无法上传:\n' + errors.join('\n'));
    }
    
    // 添加接受的文件
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0,
    }));
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });
  
  // 移除单个上传文件
  const removeUploadFile = (id: string) => {
    setUploadFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };
  
  // 清空所有上传文件
  const clearAllUploadFiles = () => {
    uploadFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setUploadFiles([]);
  };
  
  // 关闭相册集弹窗
  const closeAlbumModal = () => {
    setShowAlbumModal(false);
    setNewAlbumName('');
    setNewAlbumDescription('');
    clearAllUploadFiles();
    setUploadProgress(0);
  };

  // 更新单个图片的相册集
  const handleUpdateItemAlbum = async (itemId: string, albumId: string | null) => {
    try {
      const res = await fetch(`http://localhost:3001/api/gallery/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ album_id: albumId }),
      });
      if (!res.ok) throw new Error('Failed to update item');
      fetchGalleryData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  // 批量归属相册集
  const handleBatchAssign = async () => {
    if (selectedItems.size === 0) {
      alert('请先选择图片');
      return;
    }
    try {
      const promises = Array.from(selectedItems).map(id =>
        fetch(`http://localhost:3001/api/gallery/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ album_id: batchAlbumId || null }),
        })
      );
      await Promise.all(promises);
      setSelectedItems(new Set());
      setBatchAlbumId('');
      fetchGalleryData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to batch update');
    }
  };

  // 删除相册集
  const handleDeleteAlbum = async (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    
    const albumImages = galleryItems.filter(item => item.album_id === albumId);
    const confirmMsg = albumImages.length > 0 
      ? `确定要删除相册集「${album.name}」吗？\n该相册集包含 ${albumImages.length} 张图片，图片将变为未分组状态。`
      : `确定要删除相册集「${album.name}」吗？`;
    
    if (!confirm(confirmMsg)) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/gallery/albums/${albumId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('删除相册集失败');
      
      setAlbumFilter('all');
      fetchAlbums();
      fetchGalleryData();
      alert('相册集已删除');
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  };

  // 切换选中状态
  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.size === filteredGalleryItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredGalleryItems.map(item => item.id)));
    }
  };

  // ========================================
  // 长廊配置操作
  // ========================================

  // 打开长廊配置弹窗
  const openShowcaseModal = async () => {
    // 获取当前长廊配置
    try {
      const res = await fetch('http://localhost:3001/api/gallery/showcase');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setShowcaseItems(data.data);
          setShowcaseSelected(new Set(data.data.map((item: GalleryItem) => item.id)));
        }
      }
    } catch (err) {
      console.error('Error fetching showcase:', err);
    }
    setShowShowcaseModal(true);
  };

  // 切换长廊选中状态
  const toggleShowcaseItem = (id: string) => {
    const newSelected = new Set(showcaseSelected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setShowcaseSelected(newSelected);
  };

  // 全选/取消全选长廊
  const toggleShowcaseSelectAll = () => {
    const filtered = getFilteredShowcaseItems();
    if (filtered.every(item => showcaseSelected.has(item.id))) {
      // 取消选中筛选后的所有项
      const newSelected = new Set(showcaseSelected);
      filtered.forEach(item => newSelected.delete(item.id));
      setShowcaseSelected(newSelected);
    } else {
      // 选中筛选后的所有项
      const newSelected = new Set(showcaseSelected);
      filtered.forEach(item => newSelected.add(item.id));
      setShowcaseSelected(newSelected);
    }
  };

  // 获取筛选后的长廊图片列表
  const getFilteredShowcaseItems = () => {
    if (!showcaseSearch.trim()) return galleryItems;
    const search = showcaseSearch.toLowerCase();
    return galleryItems.filter(item => 
      item.title.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  };

  // 保存长廊配置
  const saveShowcaseConfig = async () => {
    try {
      // 构建配置数据，按选中顺序排序
      const items = Array.from(showcaseSelected).map((id, index) => ({
        id,
        showcase_order: index + 1,
      }));

      const res = await fetch('http://localhost:3001/api/gallery/showcase/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error('Failed to save showcase config');
      
      setShowShowcaseModal(false);
      fetchGalleryData();
      alert('长廊配置已保存');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save showcase config');
    }
  };

  // 移动长廊项顺序
  const moveShowcaseItem = (id: string, direction: 'up' | 'down') => {
    const arr = Array.from(showcaseSelected);
    const index = arr.indexOf(id);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
    } else if (direction === 'down' && index < arr.length - 1) {
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    }
    
    setShowcaseSelected(new Set(arr));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPath');
    router.push('/admin/login');
  };

  // 排序处理
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 筛选和排序文章
  const filteredArticles = articles
    .filter(article => statusFilter === 'all' || article.status === statusFilter)
    .sort((a, b) => {
      const aVal = new Date(a[sortField]).getTime();
      const bVal = new Date(b[sortField]).getTime();
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  // 筛选相册（按相册集）
  const filteredGalleryItems = galleryItems.filter(item => {
    if (albumFilter === 'all') return true;
    if (albumFilter === 'none') return !item.album_id;
    return item.album_id === albumFilter;
  });

  // 获取相册集名称
  const getAlbumName = (albumId: string | null) => {
    if (!albumId) return '未分组';
    const album = albums.find(a => a.id === albumId);
    return album ? album.name : '未知';
  };

  // ========================================
  // 渲染
  // ========================================

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">错误: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* ========================================
       * 顶部标题栏
       * ======================================== */}
      <header className="admin-header">
        <h1>管理后台</h1>
        <div className="admin-actions">
          <ThemeToggle variant="compact" size="sm" />
          <button onClick={handleLogout} className="btn btn-secondary">
            退出
          </button>
        </div>
      </header>

      {/* ========================================
       * 标签页切换
       * ======================================== */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          📝 文章管理
        </button>
        <button
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          🖼️ 相册管理
        </button>
      </div>

      {/* ========================================
       * 文章管理模块
       * ======================================== */}
      {activeTab === 'articles' && (
        <>
          {/* 统计卡片 - 带颜色区分 */}
          <div className="stats-grid">
            <div className="stat-card stat-card-blue">
              <div className="stat-value">{articleStats.total}</div>
              <div className="stat-label">总文章数</div>
              <div className="stat-progress">
                <div className="progress-bar" style={{ width: '100%', background: '#3b82f6' }} />
              </div>
            </div>
            <div className="stat-card stat-card-green">
              <div className="stat-value">{articleStats.published}</div>
              <div className="stat-label">已发布</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: articleStats.total > 0 ? `${(articleStats.published / articleStats.total) * 100}%` : '0%',
                    background: '#10b981' 
                  }} 
                />
              </div>
            </div>
            <div className="stat-card stat-card-gray">
              <div className="stat-value">{articleStats.draft}</div>
              <div className="stat-label">草稿</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: articleStats.total > 0 ? `${(articleStats.draft / articleStats.total) * 100}%` : '0%',
                    background: '#6b7280' 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* 筛选栏 + 新建按钮 */}
          <div className="filter-bar">
            <div className="filter-group">
              <label>状态筛选：</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="filter-select"
              >
                <option value="all">全部</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
              </select>
            </div>
            <Link href="/admin/articles/new" className="btn btn-primary">
              + 新建文章
            </Link>
          </div>

          {/* 文章列表 */}
          <div className="articles-table-container">
            <table className="articles-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>状态</th>
                  <th 
                    className="sortable-th"
                    onClick={() => handleSort('created_at')}
                  >
                    创建时间 {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="sortable-th"
                    onClick={() => handleSort('updated_at')}
                  >
                    更新时间 {sortField === 'updated_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">暂无文章</td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id}>
                      <td className="article-title-cell">
                        <Link href={`/admin/articles/${article.id}`}>{article.title}</Link>
                      </td>
                      <td>
                        <span className={`status-badge status-${article.status}`}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {new Date(article.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="date-cell">
                        {new Date(article.updated_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="actions-cell">
                        <Link href={`/articles/${article.slug}`} className="btn-link btn-preview" target="_blank">
                          预览
                        </Link>
                        <Link href={`/admin/articles/${article.id}`} className="btn-link btn-edit">
                          编辑
                        </Link>
                        <button onClick={() => handleDeleteArticle(article.id)} className="btn-link btn-delete">
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ========================================
       * 相册管理模块
       * ======================================== */}
      {activeTab === 'gallery' && (
        <>
          {/* 统计卡片 */}
          <div className="stats-grid">
            <div className="stat-card stat-card-blue">
              <div className="stat-value">{galleryStats.total}</div>
              <div className="stat-label">总作品数</div>
              <div className="stat-progress">
                <div className="progress-bar" style={{ width: '100%', background: '#3b82f6' }} />
              </div>
            </div>
            <div className="stat-card stat-card-green">
              <div className="stat-value">{galleryStats.albumCount}</div>
              <div className="stat-label">相册集数</div>
              <div className="stat-progress">
                <div className="progress-bar" style={{ width: '100%', background: '#10b981' }} />
              </div>
            </div>
            <div className="stat-card stat-card-gray">
              <div className="stat-value">{galleryItems.filter(i => !i.album_id).length}</div>
              <div className="stat-label">未分组</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: galleryStats.total > 0 ? `${(galleryItems.filter(i => !i.album_id).length / galleryStats.total) * 100}%` : '0%',
                    background: '#6b7280' 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* 操作栏 */}
          <div className="filter-bar">
            <div className="filter-group">
              <label>相册集筛选：</label>
              <select 
                className="filter-select"
                value={albumFilter}
                onChange={(e) => setAlbumFilter(e.target.value)}
              >
                <option value="all">全部</option>
                <option value="none">未分组</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>{album.name}</option>
                ))}
              </select>
              {albumFilter !== 'all' && albumFilter !== 'none' && (
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteAlbum(albumFilter)}
                  title="删除当前相册集"
                >
                  🗑️ 删除相册集
                </button>
              )}
            </div>
            <div className="action-buttons">
              <button 
                className="btn btn-accent"
                onClick={openShowcaseModal}
              >
                🖼️ 长廊图片配置
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAlbumModal(true)}
              >
                + 新建相册集
              </button>
              <Link href="/admin/gallery/new" className="btn btn-primary">
                + 新建作品
              </Link>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedItems.size > 0 && (
            <div className="batch-bar">
              <span className="batch-info">已选择 {selectedItems.size} 项</span>
              <div className="batch-actions">
                <select 
                  className="filter-select"
                  value={batchAlbumId}
                  onChange={(e) => setBatchAlbumId(e.target.value)}
                >
                  <option value="">移除分组</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>{album.name}</option>
                  ))}
                </select>
                <button className="btn btn-primary btn-sm" onClick={handleBatchAssign}>
                  批量归属
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedItems(new Set())}>
                  取消选择
                </button>
              </div>
            </div>
          )}

          {/* 相册列表 */}
          <div className="articles-table-container">
            <table className="articles-table gallery-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.size === filteredGalleryItems.length && filteredGalleryItems.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>缩略图</th>
                  <th>标题</th>
                  <th>相册集</th>
                  <th>分类</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredGalleryItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-row">暂无作品</td>
                  </tr>
                ) : (
                  filteredGalleryItems.map((item) => (
                    <tr key={item.id} className={selectedItems.has(item.id) ? 'selected-row' : ''}>
                      <td className="checkbox-cell">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                        />
                      </td>
                      <td className="thumbnail-cell">
                        <img 
                          src={item.img_url} 
                          alt={item.title}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      </td>
                      <td className="article-title-cell">
                        {item.title}
                        {item.showcase_order !== null && (
                          <span className="showcase-badge">🖼️ 长廊</span>
                        )}
                      </td>
                      <td>
                        <select 
                          className="album-select"
                          value={item.album_id || ''}
                          onChange={(e) => handleUpdateItemAlbum(item.id, e.target.value || null)}
                        >
                          <option value="">未分组</option>
                          {albums.map(album => (
                            <option key={album.id} value={album.id}>{album.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className="category-badge">{item.category}</span>
                      </td>
                      <td className="date-cell">
                        {new Date(item.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="actions-cell">
                        <Link href={`/gallery`} className="btn-link btn-preview" target="_blank">
                          预览
                        </Link>
                        <Link href={`/admin/gallery/${item.id}`} className="btn-link btn-edit">
                          编辑
                        </Link>
                        <button onClick={() => handleDeleteGalleryItem(item.id)} className="btn-link btn-delete">
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 新建相册集弹窗（带批量上传） */}
          {showAlbumModal && (
            <div className="modal-overlay" onClick={closeAlbumModal}>
              <div className="album-modal" onClick={e => e.stopPropagation()}>
                <div className="album-modal-header">
                  <h3>📁 新建相册集</h3>
                  <button className="modal-close" onClick={closeAlbumModal}>×</button>
                </div>
                
                <div className="album-modal-body">
                  {/* 基础信息区 */}
                  <div className="album-info-section">
                    <div className="form-group">
                      <label>相册集名称 *</label>
                      <input
                        type="text"
                        className="modal-input"
                        placeholder="输入相册集名称"
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                        disabled={isUploading}
                      />
                    </div>
                    <div className="form-group">
                      <label>描述（可选）</label>
                      <textarea
                        className="modal-textarea"
                        placeholder="输入相册集描述"
                        value={newAlbumDescription}
                        onChange={(e) => setNewAlbumDescription(e.target.value)}
                        rows={2}
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                  
                  {/* 批量上传区 */}
                  <div className="upload-section">
                    <div className="upload-header">
                      <label>批量上传照片</label>
                      {uploadFiles.length > 0 && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={clearAllUploadFiles}
                          disabled={isUploading}
                        >
                          清空全部
                        </button>
                      )}
                    </div>
                    
                    {/* 拖拽上传区域 */}
                    <div
                      {...getRootProps()}
                      className={`upload-dropzone ${isDragActive ? 'dragging' : ''} ${isUploading ? 'disabled' : ''}`}
                    >
                      <input {...getInputProps()} disabled={isUploading} />
                      {isDragActive ? (
                        <div className="dropzone-content">
                          <span className="dropzone-icon">📥</span>
                          <p>松开鼠标上传图片</p>
                        </div>
                      ) : (
                        <div className="dropzone-content">
                          <span className="dropzone-icon">📷</span>
                          <p>拖入照片或点击选择</p>
                          <span className="dropzone-hint">支持 JPG/PNG/WebP，单张最大 5MB</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 上传进度条 */}
                    {isUploading && (
                      <div className="upload-progress-bar">
                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                        <span className="progress-text">{uploadProgress}%</span>
                      </div>
                    )}
                    
                    {/* 照片预览网格 */}
                    {uploadFiles.length > 0 && (
                      <div className="upload-preview-grid">
                        {uploadFiles.map(file => (
                          <div 
                            key={file.id} 
                            className={`preview-item ${file.status}`}
                          >
                            <img src={file.preview} alt={file.file.name} />
                            <div className="preview-overlay">
                              {file.status === 'uploading' && (
                                <div className="preview-spinner" />
                              )}
                              {file.status === 'success' && (
                                <span className="preview-success">✓</span>
                              )}
                              {file.status === 'error' && (
                                <span className="preview-error" title={file.error}>✕</span>
                              )}
                            </div>
                            {!isUploading && (
                              <button 
                                className="preview-remove"
                                onClick={() => removeUploadFile(file.id)}
                              >
                                ×
                              </button>
                            )}
                            <span className="preview-name">{file.file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="album-modal-footer">
                  <span className="upload-count">
                    {uploadFiles.length > 0 && `已选择 ${uploadFiles.length} 张照片`}
                  </span>
                  <div className="modal-actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={closeAlbumModal}
                      disabled={isUploading}
                    >
                      取消
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleCreateAlbum}
                      disabled={isUploading || !newAlbumName.trim()}
                    >
                      {isUploading ? '创建中...' : '一键保存'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 长廊图片配置弹窗 */}
          {showShowcaseModal && (
            <div className="modal-overlay" onClick={() => setShowShowcaseModal(false)}>
              <div className="showcase-modal" onClick={e => e.stopPropagation()}>
                <div className="showcase-modal-header">
                  <h3>🖼️ 长廊图片配置</h3>
                  <button className="modal-close" onClick={() => setShowShowcaseModal(false)}>×</button>
                </div>
                
                <div className="showcase-modal-body">
                  {/* 左侧：图片列表 */}
                  <div className="showcase-list-panel">
                    <div className="showcase-search">
                      <input
                        type="text"
                        placeholder="搜索图片标题/分类..."
                        value={showcaseSearch}
                        onChange={(e) => setShowcaseSearch(e.target.value)}
                      />
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={toggleShowcaseSelectAll}
                      >
                        {getFilteredShowcaseItems().every(item => showcaseSelected.has(item.id)) ? '取消全选' : '全选'}
                      </button>
                    </div>
                    <div className="showcase-list">
                      {getFilteredShowcaseItems().map(item => (
                        <div 
                          key={item.id} 
                          className={`showcase-list-item ${showcaseSelected.has(item.id) ? 'selected' : ''}`}
                          onClick={() => toggleShowcaseItem(item.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={showcaseSelected.has(item.id)}
                            onChange={() => {}}
                          />
                          <img src={item.img_url} alt={item.title} />
                          <div className="showcase-item-info">
                            <span className="showcase-item-title">{item.title}</span>
                            <span className="showcase-item-category">{item.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 右侧：已选排序区 */}
                  <div className="showcase-order-panel">
                    <h4>已选图片排序 ({showcaseSelected.size})</h4>
                    <div className="showcase-order-list">
                      {Array.from(showcaseSelected).map((id, index) => {
                        const item = galleryItems.find(i => i.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className="showcase-order-item">
                            <span className="order-num">{index + 1}</span>
                            <img src={item.img_url} alt={item.title} />
                            <span className="order-title">{item.title}</span>
                            <div className="order-actions">
                              <button 
                                onClick={() => moveShowcaseItem(id, 'up')}
                                disabled={index === 0}
                              >↑</button>
                              <button 
                                onClick={() => moveShowcaseItem(id, 'down')}
                                disabled={index === showcaseSelected.size - 1}
                              >↓</button>
                              <button 
                                className="remove-btn"
                                onClick={() => toggleShowcaseItem(id)}
                              >×</button>
                            </div>
                          </div>
                        );
                      })}
                      {showcaseSelected.size === 0 && (
                        <div className="showcase-empty">从左侧选择图片添加到长廊</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="showcase-modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowShowcaseModal(false)}>
                    取消
                  </button>
                  <button className="btn btn-primary" onClick={saveShowcaseConfig}>
                    保存配置
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================
       * 样式
       * ======================================== */}
      <style jsx>{`
        /* 标签页 */
        .admin-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--color-border);
        }
        
        .tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: all 0.2s ease;
        }
        
        .tab-btn:hover {
          color: var(--color-text-primary);
          background: var(--color-surface-hover);
        }
        
        .tab-btn.active {
          color: var(--color-accent);
          border-bottom-color: var(--color-accent);
        }

        /* 统计卡片颜色 */
        .stat-card-blue {
          border-left: 4px solid #3b82f6;
        }
        
        .stat-card-green {
          border-left: 4px solid #10b981;
        }
        
        .stat-card-gray {
          border-left: 4px solid #6b7280;
        }

        /* 进度条 */
        .stat-progress {
          margin-top: 8px;
          height: 4px;
          background: var(--color-border);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        /* 筛选栏 */
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px 16px;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .filter-group label {
          color: var(--color-text-secondary);
          font-size: 14px;
        }
        
        .filter-select {
          padding: 6px 12px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: var(--color-background);
          color: var(--color-text-primary);
          font-size: 14px;
        }

        /* 可排序表头 */
        .sortable-th {
          cursor: pointer;
          user-select: none;
        }
        
        .sortable-th:hover {
          background: var(--color-surface-hover);
        }

        /* 预览按钮 */
        .btn-preview {
          color: #3b82f6;
        }
        
        .btn-preview:hover {
          color: #2563eb;
        }

        /* 分类标签 */
        .category-badge {
          display: inline-block;
          padding: 4px 8px;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        /* 缩略图单元格 */
        .thumbnail-cell {
          width: 80px;
          padding: 8px !important;
        }

        /* 操作按钮组 */
        .action-buttons {
          display: flex;
          gap: 8px;
        }

        /* 批量操作栏 */
        .batch-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px 16px;
          background: #1a3a4a;
          border: 1px solid #4a7a96;
          border-radius: 4px;
        }

        .batch-info {
          color: #4a7a96;
          font-weight: 500;
        }

        .batch-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 13px;
        }

        /* 危险按钮 */
        .btn-danger {
          background: #ef4444 !important;
          border-color: #ef4444 !important;
          color: #fff !important;
        }

        .btn-danger:hover {
          background: #dc2626 !important;
          border-color: #dc2626 !important;
        }

        /* 复选框单元格 */
        .checkbox-cell {
          width: 40px;
          text-align: center;
        }

        .checkbox-cell input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        /* 选中行高亮 */
        .selected-row {
          background: rgba(74, 122, 150, 0.15) !important;
        }

        /* 相册集下拉选择 */
        .album-select {
          padding: 4px 8px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: var(--color-background);
          color: var(--color-text-primary);
          font-size: 13px;
          min-width: 100px;
        }

        /* 弹窗样式 */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--color-surface-raised);
          border: 2px solid var(--color-border);
          border-radius: 8px;
          padding: 24px;
          min-width: 320px;
          max-width: 90vw;
        }

        .modal-content h3 {
          margin: 0 0 16px 0;
          color: var(--color-text-primary);
          font-size: 18px;
        }

        .modal-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: var(--color-background);
          color: var(--color-text-primary);
          font-size: 14px;
          margin-bottom: 16px;
        }

        .modal-input:focus {
          outline: none;
          border-color: #4a7a96;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        /* 暗色模式弹窗优化 */
        :global(.dark) .modal-content {
          background: #1f1f1f;
          border-color: #4a7a96;
        }

        :global(.dark) .modal-input {
          background: #121212;
          border-color: #333;
        }

        :global(.dark) .batch-bar {
          background: #1a2a3a;
        }

        /* ========================================
         * 新建相册集弹窗样式
         * ======================================== */
        .album-modal {
          background: var(--color-surface-raised);
          border: 2px solid #4a7a96;
          border-radius: 2px;
          width: 90vw;
          max-width: 700px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          font-family: 'Courier New', monospace;
        }

        .album-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 2px solid var(--color-border);
        }

        .album-modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: var(--color-text-primary);
        }

        .album-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .album-info-section {
          margin-bottom: 20px;
        }

        .album-info-section .form-group {
          margin-bottom: 16px;
        }

        .album-info-section label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary);
        }

        .modal-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid var(--color-border);
          border-radius: 2px;
          background: var(--color-background);
          color: var(--color-text-primary);
          font-size: 14px;
          font-family: 'Courier New', monospace;
          resize: vertical;
        }

        .modal-textarea:focus {
          outline: none;
          border-color: #4a7a96;
        }

        /* 上传区域 */
        .upload-section {
          border: 2px solid var(--color-border);
          border-radius: 2px;
          padding: 16px;
          background: var(--color-background);
        }

        .upload-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .upload-header label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary);
        }

        .upload-dropzone {
          border: 2px dashed #4a7a96;
          border-radius: 2px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--color-surface-raised);
        }

        .upload-dropzone:hover:not(.disabled) {
          border-color: #5a9ab6;
          background: rgba(74, 122, 150, 0.05);
        }

        .upload-dropzone.dragging {
          border-color: #22d3ee;
          background: rgba(34, 211, 238, 0.08);
          border-style: solid;
        }

        .upload-dropzone.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .dropzone-icon {
          font-size: 32px;
        }

        .dropzone-content p {
          margin: 0;
          font-size: 15px;
          color: var(--color-text-primary);
        }

        .dropzone-hint {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        /* 上传进度条 */
        .upload-progress-bar {
          margin-top: 12px;
          height: 24px;
          background: var(--color-border);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #4a7a96;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }

        /* 照片预览网格 */
        .upload-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-top: 16px;
          max-height: 240px;
          overflow-y: auto;
          padding: 4px;
        }

        .preview-item {
          position: relative;
          aspect-ratio: 1;
          border: 2px solid var(--color-border);
          border-radius: 2px;
          overflow: hidden;
          background: var(--color-surface-raised);
        }

        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-item.success {
          border-color: #10b981;
        }

        .preview-item.error {
          border-color: #ef4444;
        }

        .preview-item.uploading {
          border-color: #4a7a96;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .preview-item.uploading .preview-overlay,
        .preview-item.success .preview-overlay,
        .preview-item.error .preview-overlay {
          opacity: 1;
        }

        .preview-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .preview-success {
          width: 28px;
          height: 28px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
        }

        .preview-error {
          width: 28px;
          height: 28px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
        }

        .preview-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border: none;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          border-radius: 2px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .preview-item:hover .preview-remove {
          opacity: 1;
        }

        .preview-remove:hover {
          background: #ef4444;
        }

        .preview-name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 4px 6px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .album-modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-top: 2px solid var(--color-border);
        }

        .upload-count {
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        /* 暗色模式相册弹窗 */
        :global(.dark) .album-modal {
          background: #1f1f1f !important;
          border-color: #4a7a96 !important;
        }

        :global(.dark) .modal-textarea {
          background: #121212 !important;
          border-color: #333 !important;
        }

        :global(.dark) .upload-section {
          background: #121212 !important;
          border-color: #333 !important;
        }

        :global(.dark) .upload-dropzone {
          background: #1a1a1a !important;
        }

        :global(.dark) .preview-item {
          background: #1a1a1a !important;
        }

        /* 长廊标识 */
        .showcase-badge {
          display: inline-block;
          margin-left: 8px;
          padding: 2px 6px;
          background: rgba(74, 122, 150, 0.2);
          border: 1px solid #4a7a96;
          border-radius: 4px;
          font-size: 11px;
          color: #4a7a96;
        }

        /* 长廊配置按钮 */
        :global(.btn-accent) {
          background: #4a7a96 !important;
          border-color: #4a7a96 !important;
          color: #fff !important;
        }

        :global(.btn-accent:hover) {
          background: #3d6a84 !important;
        }

        /* 长廊配置弹窗 */
        .showcase-modal {
          background: var(--color-surface-raised);
          border: 2px solid #4a7a96;
          border-radius: 8px;
          width: 90vw;
          max-width: 900px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .showcase-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }

        .showcase-modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: var(--color-text-primary);
        }

        .modal-close {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          font-size: 24px;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: 4px;
        }

        .modal-close:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }

        .showcase-modal-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* 左侧图片列表 */
        .showcase-list-panel {
          flex: 1;
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
        }

        .showcase-search {
          padding: 12px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          gap: 8px;
        }

        .showcase-search input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: var(--color-background);
          color: var(--color-text-primary);
          font-size: 13px;
        }

        .showcase-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .showcase-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .showcase-list-item:hover {
          background: var(--color-surface-hover);
        }

        .showcase-list-item.selected {
          background: rgba(74, 122, 150, 0.15);
          border-color: #4a7a96;
        }

        .showcase-list-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .showcase-list-item img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
        }

        .showcase-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .showcase-item-title {
          font-size: 13px;
          color: var(--color-text-primary);
        }

        .showcase-item-category {
          font-size: 11px;
          color: var(--color-text-secondary);
        }

        /* 右侧排序区 */
        .showcase-order-panel {
          width: 320px;
          display: flex;
          flex-direction: column;
        }

        .showcase-order-panel h4 {
          margin: 0;
          padding: 12px 16px;
          font-size: 14px;
          color: var(--color-text-primary);
          border-bottom: 1px solid var(--color-border);
        }

        .showcase-order-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .showcase-order-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          margin-bottom: 6px;
        }

        .order-num {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #4a7a96;
          color: #fff;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .showcase-order-item img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        }

        .order-title {
          flex: 1;
          font-size: 12px;
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .order-actions {
          display: flex;
          gap: 4px;
        }

        .order-actions button {
          width: 24px;
          height: 24px;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          color: var(--color-text-secondary);
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .order-actions button:hover:not(:disabled) {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }

        .order-actions button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .order-actions .remove-btn {
          color: #ef4444;
        }

        .order-actions .remove-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .showcase-empty {
          text-align: center;
          padding: 32px;
          color: var(--color-text-secondary);
          font-size: 13px;
        }

        .showcase-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid var(--color-border);
        }

        /* 暗色模式长廊弹窗 */
        :global(.dark) .showcase-modal {
          background: #1f1f1f;
        }

        :global(.dark) .showcase-search input {
          background: #121212;
        }
      `}</style>
    </div>
  );
}
