/**
 * 标题揭示动画系统
 * 使用 IntersectionObserver 检测标题进入视口，触发揭示动画
 */

export interface RevealConfig {
  animationType: 'cursor-blink' | 'mask-reveal';
  duration: number;
  threshold: number;
  reducedMotion?: boolean;
}

export class HeadingReveal {
  private observer: IntersectionObserver | null = null;
  private revealed: Set<HTMLElement> = new Set();
  private config: RevealConfig;

  constructor(config: Partial<RevealConfig> = {}) {
    this.config = {
      animationType: 'mask-reveal',
      duration: 250,
      threshold: 0.5,
      reducedMotion: this.checkReducedMotion(),
      ...config,
    };

    if (this.config.reducedMotion) {
      return;
    }

    this.initObserver();
  }

  private checkReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private initObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.revealed.has(entry.target as HTMLElement)) {
            this.reveal(entry.target as HTMLElement);
          }
        });
      },
      {
        threshold: this.config.threshold,
        rootMargin: '0px 0px -10% 0px',
      }
    );
  }

  public observe(headings: HTMLElement[]): void {
    if (this.config.reducedMotion || !this.observer) {
      return;
    }

    headings.forEach((heading) => {
      heading.classList.add('heading-reveal-hidden');
      this.observer!.observe(heading);
    });
  }

  private reveal(heading: HTMLElement): void {
    if (this.config.reducedMotion) {
      return;
    }

    this.revealed.add(heading);
    heading.classList.remove('heading-reveal-hidden');

    if (this.config.animationType === 'cursor-blink') {
      heading.classList.add('heading-reveal-cursor');
    } else {
      heading.classList.add('heading-reveal-mask');
    }

    heading.style.setProperty('--reveal-duration', `${this.config.duration}ms`);

    setTimeout(() => {
      heading.classList.remove('heading-reveal-cursor', 'heading-reveal-mask');
      heading.style.removeProperty('--reveal-duration');
    }, this.config.duration);
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
}

export function initHeadingReveal(
  container: HTMLElement | Document = document,
  config?: Partial<RevealConfig>
): HeadingReveal {
  const headingReveal = new HeadingReveal(config);
  
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
  );
  
  headingReveal.observe(headings);
  
  return headingReveal;
}
