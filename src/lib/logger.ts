// Logger simple (stub)
export const logger = {
  info: (...args: any[]) => console.info('[info]', ...args),
  warn: (...args: any[]) => console.warn('[warn]', ...args),
  error: (...args: any[]) => console.error('[error]', ...args),
  debug: (...args: any[]) => {
    if (process.env.DEBUG === 'true') {
      console.debug('[debug]', ...args);
    }
  },
};
