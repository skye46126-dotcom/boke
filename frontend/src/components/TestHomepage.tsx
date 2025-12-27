/**
 * 测试主页组件 - 简化版本用于调试
 */

'use client';

import React from 'react';

export default function TestHomepage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#f5f2ef',
      position: 'relative',
      fontFamily: 'monospace'
    }}>
      {/* 测试头部 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#4a7a96',
        color: '#f5f2ef',
        padding: '10px 20px',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        像素水墨风主页测试
      </div>

      {/* 测试中心内容 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: '#4a7a96',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f5f2ef',
          fontSize: '24px'
        }}>
          头像
        </div>
        
        <div style={{
          background: '#8c6b48',
          color: '#f5f2ef',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          marginBottom: '20px'
        }}>
          正在构建我的数字世界...
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          {['文章', '关于', '项目', 'GitHub'].map((item) => (
            <div key={item} style={{
              background: '#2c2c2c',
              color: '#f5f2ef',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 测试侧边栏 */}
      <div style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: '#2c2c2c',
        color: '#f5f2ef',
        padding: '20px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <div>侧边栏测试</div>
        <div style={{ marginTop: '10px' }}>主题切换</div>
        <div style={{ marginTop: '10px' }}>标签云</div>
      </div>
    </div>
  );
}