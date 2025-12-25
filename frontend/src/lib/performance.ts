/**
 * 性能监控工具
 */

export function reportWebVitals(metric: any) {
  // 在生产环境中，可以将这些指标发送到分析服务
  if (process.env.NODE_ENV === 'production') {
    // 示例：发送到 Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
    
    console.log(metric);
  }
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start;
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }) as Promise<T>;
  }
  
  const duration = performance.now() - start;
  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  return result;
}
