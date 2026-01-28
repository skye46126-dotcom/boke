import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// ============================================
// Date Formatting Utilities
// ============================================

/**
 * Format date string to localized format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale code (default: 'zh-CN')
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, locale: string = 'zh-CN'): string {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Format date as relative time (e.g., "2 days ago")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export function formatRelativeDate(dateString: string | Date): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// ============================================
// Content Processing Utilities
// ============================================

/**
 * Extract plain text excerpt from HTML content
 * @param content - HTML content string
 * @param length - Maximum length of excerpt (default: 150)
 * @returns Plain text excerpt
 */
export function getExcerpt(content: string, length: number = 150): string {
    if (!content) return ''
    const text = content.replace(/<[^>]*>/g, '').slice(0, length)
    return text + (content.length > length ? '...' : '')
}

/**
 * Generate URL-friendly slug from title
 * @param title - Article title
 * @returns URL-safe slug
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

// ============================================
// Table of Contents Utilities
// ============================================

export interface Heading {
    id: string
    text: string
    level: number
}

/**
 * Extract table of contents from HTML content
 * @param htmlContent - HTML content string
 * @returns Array of headings with id, text, and level
 */
export function extractTableOfContents(htmlContent: string): Heading[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const headings = doc.querySelectorAll('h2, h3')

    return Array.from(headings).map(h => ({
        id: h.id || h.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
        text: h.textContent || '',
        level: parseInt(h.tagName[1])
    }))
}

/**
 * Add IDs to headings in the DOM if they don't have them
 * @param selector - CSS selector for content container
 * @param headings - Array of headings from extractTableOfContents
 */
export function addHeadingIds(selector: string, headings: Heading[]): void {
    if (typeof document === 'undefined') return

    const elements = document.querySelectorAll(`${selector} h2, ${selector} h3`)
    elements.forEach((heading, index) => {
        if (!heading.id && headings[index]) {
            heading.id = headings[index].id
        }
    })
}
