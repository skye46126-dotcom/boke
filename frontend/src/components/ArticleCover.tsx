'use client';

import { useState } from 'react';

interface ArticleCoverProps {
  src?: string | null;
  alt: string;
}

export default function ArticleCover({ src, alt }: ArticleCoverProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="article-cover-placeholder">
        <span>📝</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}
