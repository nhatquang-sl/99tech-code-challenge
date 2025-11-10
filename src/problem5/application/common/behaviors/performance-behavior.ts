import { ICommand, IPipelineBehavior } from '@qnn92/mediatorts';
import { performance } from 'node:perf_hooks';

export default class PerformanceBehavior implements IPipelineBehavior {
  handle = async (request: ICommand, next: () => Promise<any>): Promise<any> => {
    const start = performance.now();
    try {
      return await next();
    } finally {
      const processedTimeMs = performance.now() - start;
      // log only if execution time > 500 ms
      if (processedTimeMs > 500) console.warn(`Execution time: ${processedTimeMs} ms`);
    }
  };
}
