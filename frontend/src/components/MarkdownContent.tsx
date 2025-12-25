'use client';

import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import hljs from 'highlight.js';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // 配置 marked
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    // 渲染 Markdown
    const rawHtml = marked(content) as string;
    
    // 使用 DOMPurify 清理 HTML，但保留安全的标签
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 's', 'del',
        'a', 'img',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'iframe', 'video', 'audio', 'source',
        'div', 'span',
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel',
        'src', 'alt', 'width', 'height',
        'class', 'id',
        'frameborder', 'allowfullscreen', 'allow',
        'controls', 'autoplay', 'loop', 'muted',
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
    });

    contentRef.current.innerHTML = cleanHtml;

    // 应用语法高亮
    contentRef.current.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });

    // 为外部链接添加 target="_blank" 和 rel="noopener noreferrer"
    contentRef.current.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // 为图片添加加载优化
    contentRef.current.querySelectorAll('img').forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });
  }, [content]);

  return <div ref={contentRef} className="markdown-content" />;
}
