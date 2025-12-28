'use client';

/**
 * 长廊批量图片上传管理页面
 * 支持：
 * 1. 批量选择并上传多张图片
 * 2. 设置图片属性（标题、描述、作者、日期）
 * 3. 自动生成图片ID和保存到 corridor.json
 */

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  author: string;
  date: string;
  order: number;
  uploaded: boolean;
  uploading: boolean;
  error?: string;
}

export default function CorridorBatchUploadPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [batchAuthor, setBatchAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 生成唯一ID
  const generateId = (filename: string) => {
    const name = filename.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now().toString(36);
    return `corridor-${name}-${timestamp}`;
  };

  // 处理文件拖放
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const today = new Date().toISOString().split('T')[0];
    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: generateId(file.name),
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      author: batchAuthor,
      date: today,
      order: images.length + index + 1,
      uploaded: false,
      uploading: false,
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [batchAuthor, images.length]);

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

  // 批量应用作者
  const applyBatchAuthor = () => {
    if (!batchAuthor) return;
    setImages(prev => prev.map(img => ({
      ...img,
      author: batchAuthor,
    })));
    setMessage({ type: 'success', text: '已批量应用作者' });
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
        formData.append('author', img.author);
        formData.append('date', img.date);
        formData.append('order', img.order.toString());

        const res = await fetch('/api/admin/upload-corridor', {
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
      background: '#F5F0E8', 
      color: '#4A3F35',
      padding: '24px',
      fontFamily: "'Noto Serif SC', Georgia, serif",
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 头部 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          background: '#FAF7F2',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #D4C7B0',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🏛️ 长廊批量上传</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link 
              href="/admin"
              style={{
                padding: '8px 16px',
                background: '#FAF7F2',
                color: '#4A3F35',
                textDecoration: 'none',
                borderRadius: '4px',
                border: '1px solid #D4C7B0',
              }}
            >
              ← 返回 CMS
            </Link>
            <Link 
              href="/gallery/showcase"
              style={{
                padding: '8px 16px',
                background: '#9E7F66',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              查看长廊
            </Link>
          </div>
        </div>

        {/* 批量设置区 */}
        <div style={{
          background: '#FAF7F2',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #D4C7B0',
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px', color: '#6B5D4D' }}>批量设置（应用到所有待上传图片）</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#8B7355' }}>
                作者
              </label>
              <input
                type="text"
                value={batchAuthor}
                onChange={(e) => setBatchAuthor(e.target.value)}
                placeholder="输入作者名"
                style={{
                  padding: '8px 12px',
                  background: '#fff',
                  border: '1px solid #D4C7B0',
                  borderRadius: '4px',
                  color: '#4A3F35',
                  minWidth: '200px',
                }}
              />
            </div>
            <button
              onClick={applyBatchAuthor}
              style={{
                padding: '8px 16px',
                background: '#9E7F66',
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
            border: `2px dashed ${isDragActive ? '#9E7F66' : '#D4C7B0'}`,
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? 'rgba(158, 127, 102, 0.1)' : '#FAF7F2',
            marginBottom: '24px',
            transition: 'all 0.2s',
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</div>
          {isDragActive ? (
            <p>放开以添加图片...</p>
          ) : (
            <>
              <p style={{ marginBottom: '8px' }}>拖放图片到这里，或点击选择文件</p>
              <p style={{ fontSize: '14px', color: '#8B7355' }}>支持 PNG, JPG, GIF, WebP 格式，可多选</p>
            </>
          )}
        </div>

        {/* 消息提示 */}
        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '16px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: message.type === 'success' ? '#166534' : '#b91c1c',
            border: `1px solid ${message.type === 'success' ? '#86efac' : '#fca5a5'}`,
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
              <span style={{ color: '#6B5D4D' }}>{images.length} 张图片，{images.filter(i => !i.uploaded).length} 待上传</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={clearUploaded}
                  style={{
                    padding: '8px 16px',
                    background: '#FAF7F2',
                    color: '#4A3F35',
                    border: '1px solid #D4C7B0',
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
                    background: isUploading ? '#B8A890' : '#9E7F66',
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}>
              {images.map(img => (
                <div
                  key={img.id}
                  style={{
                    background: '#FAF7F2',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    opacity: img.uploaded ? 0.6 : 1,
                    border: '1px solid #D4C7B0',
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
                        background: '#166534',
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
                          background: 'rgba(185, 28, 28, 0.9)',
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
                        background: '#fff',
                        border: '1px solid #D4C7B0',
                        borderRadius: '4px',
                        color: '#4A3F35',
                        boxSizing: 'border-box',
                      }}
                    />
                    <textarea
                      value={img.description}
                      onChange={(e) => updateImage(img.id, { description: e.target.value })}
                      placeholder="描述（可选）"
                      disabled={img.uploaded}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        background: '#fff',
                        border: '1px solid #D4C7B0',
                        borderRadius: '4px',
                        color: '#4A3F35',
                        resize: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={img.author}
                        onChange={(e) => updateImage(img.id, { author: e.target.value })}
                        placeholder="作者"
                        disabled={img.uploaded}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          background: '#fff',
                          border: '1px solid #D4C7B0',
                          borderRadius: '4px',
                          color: '#4A3F35',
                          fontSize: '13px',
                        }}
                      />
                      <input
                        type="date"
                        value={img.date}
                        onChange={(e) => updateImage(img.id, { date: e.target.value })}
                        disabled={img.uploaded}
                        style={{
                          width: '130px',
                          padding: '6px 8px',
                          background: '#fff',
                          border: '1px solid #D4C7B0',
                          borderRadius: '4px',
                          color: '#4A3F35',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                    {img.error && (
                      <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '8px' }}>
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
