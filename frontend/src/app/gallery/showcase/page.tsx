/**
 * Gallery Showcase Page - 画廊长廊页面
 * 
 * MVP 功能：
 * 1. 垂直上下滑动长廊 - 全屏纵向展示
 * 2. 单幅作品居中展示 - 占屏幕高度70%
 * 3. 滚轮/触屏滑动切换 - 简单位移效果
 * 4. 返回相册按钮 - 左上角导航
 */

import type { Metadata } from 'next';
import GalleryShowcase from './GalleryShowcase';

export const metadata: Metadata = {
  title: '画廊长廊 - 像素开发者',
  description: '沉浸式浏览精品作品',
};

export default function ShowcasePage() {
  return <GalleryShowcase />;
}
