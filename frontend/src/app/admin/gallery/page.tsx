'use client';

/**
 * 批量图片上传管理页面
 * 支持：
 * 1. 批量选择并上传多张图片
 * 2. 批量设置公共属性（相册ID、分类）
 * 3. 自动生成图片ID和保存到 images.json
 */

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  album_id: string;
  category: string;
  order: number;
  uploaded: boolean;
  uploading: boolean;
  error?: string;
}

interface Album {
  id: string;
  name: string;
}

const CATEGORIES = [
  { value: 'landscape', label: '风景' },
  { value: 'portrait', label: '人像' },
  { value: 'life', label: '生活' },
  { value: 'travel', label: '旅行' },
  { value: 'food', label: '美食' },
  { value: 'other', label: '其他' },
];

export default function BatchUploadPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [batchAlbumId, setBatchAlbumId] = useState('');
  const [batchCategory, setBatchCategory] = useState('other');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 加载相册列表
  useEffect(() => {
    fetch('/api/admin/albums')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAlbums(data.albums || []);
        }
      })
      .catch(console.error);
  }, []);

  // 生成唯一ID
  const generateId = (filename: string) => {
    const name = filename.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now().toString(36);
    return `${name}-${timestamp}`;
  };

  // 处理文件拖放
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: generateId(file.name),
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      album_id: batchAlbumId,
      category: batchCategory,
      order: images.length + index + 1,
      uploaded: false,
      uploading: false,
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [batchAlbumId, batchCategory, images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
  });

  // 更新单张图片属性
  const updateImage = (id: string, updates: Partial<UploadedImage>) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  // 删除图片
  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  // 批量应用属性
  const applyBatchSettings = () => {
    setImages(prev => prev.map(img => ({
      ...img,
      album_id: batchAlbumId || img.album_id,
      category: batchCategory || img.category,
    })));
    setMessage({ type: 'success', text: '已批量应用设置' });
    setTimeout(() => setMessage(null), 2000);
  };

  // 上传所有图片
  const uploadAll = async () => {
    const pendingImages = images.filter(img => !img.uploaded);
    if (pendingImages.length === 0) {
      setMessage({ type: 'error', text: '没有待上传的图片' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    let successCount = 0;
    let errorCount = 0;

    for (const img of pendingImages) {
      updateImage(img.id, { uploading: true });

      try {
        const formData = new FormData();
        formData.append('file', img.file);
        formData.append('id', img.id);
        formData.append('title', img.title);
        formData.append('description', img.description);
        formData.append('album_id', img.album_id);
        formData.append('category', img.category);
        formData.append('order', img.order.toString());

        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          updateImage(img.id, { uploaded: true, uploading: false });
          successCount++;
        } else {
          updateImage(img.id, { uploading: false, error: data.message });
          errorCount++;
        }
      } catch (error) {
        updateImage(img.id, { uploading: false, error: '上传失败' });
        errorCount++;
      }
    }

    setIsUploading(false);
    setMessage({
      type: errorCount > 0 ? 'error' : 'success',
      text: `上传完成：${successCount} 成功，${errorCount} 失败`,
    });
  };

  // 清空已上传
  const clearUploaded = () => {
    setImages(prev => {
      prev.filter(img => img.uploaded).forEach(img => URL.revokeObjectURL(img.preview));
      return prev.filter(img => !img.uploaded);
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1a1a2e', 
      color: '#eee',
      padding: '24px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 头部 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>📷 批量图片上传</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link 
              href="/admin"
              style={{
                padding: '8px 16px',
                background: '#333',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              ← 返回 CMS
            </Link>
            <Link 
              href="/gallery"
              style={{
                padding: '8px 16px',
                background: '#4a7a96',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              查看相册
            </Link>
          </div>
        </div>

        {/* 批量设置区 */}
        <div style={{
          background: '#252540',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>批量设置（应用到所有待上传图片）</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>
                所属相册
              </label>
              <select
                value={batchAlbumId}
                onChange={(e) => setBatchAlbumId(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: '#1a1a2e',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  minWidth: '200px',
                }}
              >
                <option value="">不属于任何相册</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>{album.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>
                分类
              </label>
              <select
                value={batchCategory}
                onChange={(e) => setBatchCategory(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: '#1a1a2e',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  minWidth: '150px',
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={applyBatchSettings}
              style={{
                padding: '8px 16px',
                background: '#4a7a96',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              应用到所有图片
            </button>
          </div>
        </div>

        {/* 拖放上传区 */}
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? '#4a7a96' : '#444'}`,
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? 'rgba(74, 122, 150, 0.1)' : '#252540',
            marginBottom: '24px',
            transition: 'all 0.2s',
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          {isDragActive ? (
            <p>放开以添加图片...</p>
          ) : (
            <>
              <p style={{ marginBottom: '8px' }}>拖放图片到这里，或点击选择文件</p>
              <p style={{ fontSize: '14px', color: '#888' }}>支持 PNG, JPG, GIF, WebP 格式，可多选</p>
            </>
          )}
        </div>

        {/* 消息提示 */}
        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '16px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
          }}>
            {message.text}
          </div>
        )}

        {/* 图片列表 */}
        {images.length > 0 && (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <span>{images.length} 张图片，{images.filter(i => !i.uploaded).length} 待上传</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={clearUploaded}
                  style={{
                    padding: '8px 16px',
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  清除已上传
                </button>
                <button
                  onClick={uploadAll}
                  disabled={isUploading}
                  style={{
                    padding: '8px 24px',
                    background: isUploading ? '#666' : '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {isUploading ? '上传中...' : '🚀 上传全部'}
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {images.map(img => (
                <div
                  key={img.id}
                  style={{
                    background: '#252540',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    opacity: img.uploaded ? 0.6 : 1,
                  }}
                >
                  {/* 预览图 */}
                  <div style={{ position: 'relative', paddingTop: '66.67%' }}>
                    <img
                      src={img.preview}
                      alt={img.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {img.uploaded && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#22c55e',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}>
                        ✓ 已上传
                      </div>
                    )}
                    {img.uploading && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}>
                        上传中...
                      </div>
                    )}
                    {!img.uploaded && (
                      <button
                        onClick={() => removeImage(img.id)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* 编辑区 */}
                  <div style={{ padding: '12px' }}>
                    <input
                      type="text"
                      value={img.title}
                      onChange={(e) => updateImage(img.id, { title: e.target.value })}
                      placeholder="标题"
                      disabled={img.uploaded}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        background: '#1a1a2e',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        color: '#fff',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={img.album_id}
                        onChange={(e) => updateImage(img.id, { album_id: e.target.value })}
                        disabled={img.uploaded}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: '#1a1a2e',
                          border: '1px solid #444',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      >
                        <option value="">无相册</option>
                        {albums.map(album => (
                          <option key={album.id} value={album.id}>{album.name}</option>
                        ))}
                      </select>
                      <select
                        value={img.category}
                        onChange={(e) => updateImage(img.id, { category: e.target.value })}
                        disabled={img.uploaded}
                        style={{
                          width: '80px',
                          padding: '6px',
                          background: '#1a1a2e',
                          border: '1px solid #444',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    {img.error && (
                      <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                        {img.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
