/**
 * 标题揭示动画系统
 * 使用 IntersectionObserver 检测标题进入视口，触发揭示动画
 * 使用 clip-path 蒙版和光标伪元素实现打字机效果
 */

export interface RevealConfig {
  duration: number;
  threshold: number;
  rootMargin: string;
  reducedMotion?: boolean;
}

export class HeadingReveal {
  private observer: IntersectionObserver | null = null;
  private revealed: Set<HTMLElement> = new Set();
  private config: RevealConfig;

  constructor(config: Partial<RevealConfig> = {}) {
    this.config = {
      duration: 400,
      threshold: 0.3,
      rootMargin: '0px 0px -10% 0px',
      reducedMotion: this.checkReducedMotion(),
      ...config,
    };

    if (this.config.reducedMotion) {
      console.log('[HeadingReveal] Reduced motion detected, animations disabled');
      return;
    }

    this.initObserver();
  }

  private checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private initObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          
          // 只在元素进入视口且未被揭示过时触发
          if (entry.isIntersecting && !this.revealed.has(target)) {
            this.reveal(target);
          }
        });
      },
      {
        threshold: this.config.threshold,
        rootMargin: this.config.rootMargin,
      }
    );
  }

  public observe(headings: HTMLElement[]): void {
    if (this.config.reducedMotion || !this.observer) {
      // 如果禁用动画，直接显示所有标题
      console.log('[HeadingReveal] Reduced motion enabled, showing all headings immediately');
      headings.forEach((heading) => {
        heading.classList.add('heading-revealed');
      });
      return;
    }

    console.log(`[HeadingReveal] Starting to observe ${headings.length} headings`);
    headings.forEach((heading, index) => {
      // 添加初始隐藏类
      heading.classList.add('heading-reveal-hidden');
      console.log(`[HeadingReveal] Added .heading-reveal-hidden to heading ${index}: "${heading.textContent?.substring(0, 30)}..."`);
      
      // 设置自定义动画时长
      heading.style.setProperty('--reveal-duration', `${this.config.duration}ms`);
      
      // 开始观察
      this.observer!.observe(heading);
    });
  }

  private reveal(heading: HTMLElement): void {
    if (this.config.reducedMotion) {
      return;
    }

    console.log(`[HeadingReveal] Revealing heading: "${heading.textContent?.substring(0, 30)}..."`);

    // 标记为已揭示，防止重复触发
    this.revealed.add(heading);

    // 添加揭示类，触发 CSS 动画
    heading.classList.add('is-revealing');
    console.log(`[HeadingReveal] Added .is-revealing class`);

    // 动画完成后清理类名
    setTimeout(() => {
      heading.classList.remove('heading-reveal-hidden', 'is-revealing');
      heading.classList.add('heading-revealed');
      heading.style.removeProperty('--reveal-duration');
      console.log(`[HeadingReveal] Animation complete, added .heading-revealed class`);
      
      // 停止观察已揭示的元素
      if (this.observer) {
        this.observer.unobserve(heading);
      }
    }, this.config.duration + 200); // 额外 200ms 确保光标淡出完成
  }

  public disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.revealed.clear();
  }

  public destroy(): void {
    this.disconnect();
  }

  public updateConfig(config: Partial<RevealConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.config.reducedMotion) {
      this.destroy();
    }
  }

  public isRevealed(heading: HTMLElement): boolean {
    return this.revealed.has(heading);
  }

  public getRevealedCount(): number {
    return this.revealed.size;
  }
}

/**
 * 便捷初始化函数
 */
export function initHeadingReveal(
  container: HTMLElement | Document = document,
  config?: Partial<RevealConfig>
): HeadingReveal {
  const headingReveal = new HeadingReveal(config);
  
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
  );
  
  if (headings.length > 0) {
    console.log(`[HeadingReveal] Observing ${headings.length} headings`);
    headingReveal.observe(headings);
  }
  
  return headingReveal;
}
