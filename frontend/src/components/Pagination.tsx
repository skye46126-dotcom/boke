'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/' }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination" aria-label="分页导航">
      <ul className="pagination-list">
        {currentPage > 1 && (
          <li>
            <Link 
              href={`${baseUrl}?page=${currentPage - 1}`}
              className="pagination-link"
              aria-label="上一页"
            >
              ← 上一页
            </Link>
          </li>
        )}

        {startPage > 1 && (
          <>
            <li>
              <Link href={`${baseUrl}?page=1`} className="pagination-link">
                1
              </Link>
            </li>
            {startPage > 2 && (
              <li className="pagination-ellipsis">
                <span>...</span>
              </li>
            )}
          </>
        )}

        {pages.map((page) => (
          <li key={page}>
            <Link
              href={`${baseUrl}?page=${page}`}
              className={`pagination-link ${page === currentPage ? 'active' : ''}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          </li>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="pagination-ellipsis">
                <span>...</span>
              </li>
            )}
            <li>
              <Link href={`${baseUrl}?page=${totalPages}`} className="pagination-link">
                {totalPages}
              </Link>
            </li>
          </>
        )}

        {currentPage < totalPages && (
          <li>
            <Link 
              href={`${baseUrl}?page=${currentPage + 1}`}
              className="pagination-link"
              aria-label="下一页"
            >
              下一页 →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
