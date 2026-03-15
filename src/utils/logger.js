const isDev = import.meta.env.DEV;

export const logger = {
  info: (...args) => isDev && console.info('ℹ️ [INFO]:', ...args),
  error: (...args) => console.error('🚨 [ERROR]:', ...args), // Always log errors
  warn: (...args) => isDev && console.warn('⚠️ [WARN]:', ...args),
};