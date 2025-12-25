/**
 * 磁吸 UI 元素系统
 * 实现光标跟踪和弹性吸附效果
 */

export interface MagneticConfig {
  strength: number;      // 0-1, 吸引力强度
  radius: number;        // pixels, 有效范围
  easing: 'elastic' | 'spring';  // 缓动类型
  duration: number;      // ms, 动画持续时间
  reducedMotion?: boolean; // 是否禁用动画
}

export class MagneticElement {
  private element: HTMLElement;
  private config: MagneticConfig;
  private rafId: number | null = null;
  private currentX: number = 0;
  private currentY: number = 0;
  private targetX: number = 0;
  private targetY: number = 0;
  private originalX: number = 0;
  private originalY: number = 0;
  private isActive: boolean = false;
  // eslint-disable-next-line no-unused-vars
  private boundMouseMove!: (e: MouseEvent) => void;
  private boundMouseLeave!: () => void;

  constructor(element: HTMLElement, config: Partial<MagneticConfig> = {}) {
    this.element = element;
    
    // 默认配置
    this.config = {
      strength: 0.3,
      radius: 100,
      easing: 'elastic',
      duration: 300,
      reducedMotion: this.checkReducedMotion(),
      ...config,
    };

    // 如果用户偏好减少动画，禁用磁吸效果
    if (this.config.reducedMotion) {
      return;
    }

    // 绑定事件处理器
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseLeave = this.onMouseLeave.bind(this);

    // 初始化
    this.init();
  }

  /**
   * 检查用户是否偏好减少动画
   */
  private checkReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 初始化
   */
  private init(): void {
    // 获取元素初始位置
    const rect = this.element.getBoundingClientRect();
    this.originalX = rect.left + rect.width / 2;
    this.originalY = rect.top + rect.height / 2;
    this.currentX = 0;
    this.currentY = 0;

    // 设置元素样式
    this.element.style.transition = 'none';
    this.element.style.willChange = 'transform';

    // 添加事件监听
    this.element.addEventListener('mousemove', this.boundMouseMove);
    this.element.addEventListener('mouseleave', this.boundMouseLeave);

    // 监听窗口大小变化，更新原始位置
    window.addEventListener('resize', () => {
      const rect = this.element.getBoundingClientRect();
      this.originalX = rect.left + rect.width / 2;
      this.originalY = rect.top + rect.height / 2;
    });
  }

  /**
   * 鼠标移动事件处理
   */
  private onMouseMove(e: MouseEvent): void {
    if (this.config.reducedMotion) return;

    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 计算鼠标到元素中心的距离
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 如果在有效范围内
    if (distance < this.config.radius) {
      // 计算磁力
      const force = this.calculateForce(distance);
      
      // 计算目标位置
      this.targetX = deltaX * force * this.config.strength;
      this.targetY = deltaY * force * this.config.strength;

      // 启动动画
      if (!this.isActive) {
        this.isActive = true;
        this.animate();
      }
    } else {
      // 超出范围，回到原位
      this.targetX = 0;
      this.targetY = 0;
    }
  }

  /**
   * 鼠标离开事件处理
   */
  private onMouseLeave(): void {
    // 回到原位
    this.targetX = 0;
    this.targetY = 0;
  }

  /**
   * 计算磁力（基于距离）
   */
  private calculateForce(distance: number): number {
    // 距离越近，力越大
    const normalizedDistance = distance / this.config.radius;
    
    if (this.config.easing === 'elastic') {
      // 弹性缓动：先快后慢，带有轻微回弹
      return 1 - Math.pow(normalizedDistance, 2);
    } else {
      // 弹簧缓动：平滑的非线性
      return 1 - normalizedDistance;
    }
  }

  /**
   * 缓动函数
   */
  private easeOut(t: number): number {
    if (this.config.easing === 'elastic') {
      // 弹性缓动
      const c4 = (2 * Math.PI) / 3;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    } else {
      // 弹簧缓动（cubic-bezier）
      return 1 - Math.pow(1 - t, 3);
    }
  }

  /**
   * 动画循环
   */
  private animate(): void {
    if (this.config.reducedMotion) {
      this.isActive = false;
      return;
    }

    // 平滑插值
    const lerp = 0.15; // 插值系数
    this.currentX += (this.targetX - this.currentX) * lerp;
    this.currentY += (this.targetY - this.currentY) * lerp;

    // 应用变换
    this.element.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;

    // 检查是否接近目标位置
    const deltaX = Math.abs(this.targetX - this.currentX);
    const deltaY = Math.abs(this.targetY - this.currentY);

    if (deltaX > 0.1 || deltaY > 0.1) {
      // 继续动画
      this.rafId = requestAnimationFrame(() => this.animate());
    } else {
      // 停止动画
      this.isActive = false;
      this.rafId = null;
    }
  }

  /**
   * 销毁实例
   */
  public destroy(): void {
    // 取消动画
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // 移除事件监听
    this.element.removeEventListener('mousemove', this.boundMouseMove);
    this.element.removeEventListener('mouseleave', this.boundMouseLeave);

    // 重置样式
    this.element.style.transform = '';
    this.element.style.transition = '';
    this.element.style.willChange = '';

    this.isActive = false;
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<MagneticConfig>): void {
    this.config = { ...this.config, ...config };
    
    // 如果启用了 reducedMotion，销毁效果
    if (this.config.reducedMotion) {
      this.destroy();
    }
  }
}

/**
 * 批量初始化磁吸元素
 */
export function initMagneticElements(
  selector: string,
  config?: Partial<MagneticConfig>
): MagneticElement[] {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const instances: MagneticElement[] = [];

  elements.forEach((element) => {
    const instance = new MagneticElement(element, config);
    instances.push(instance);
  });

  return instances;
}

/**
 * 销毁所有磁吸元素
 */
export function destroyMagneticElements(instances: MagneticElement[]): void {
  instances.forEach((instance) => instance.destroy());
}
