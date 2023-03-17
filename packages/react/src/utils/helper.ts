/**
 * 判断是否是系统标签
 *
 * @param c 组件
 */
export const isSystemType = (c: any) => typeof c === 'string' || typeof c?.type === 'string';

export const isValidComponent = (target: any) =>
  target && (typeof target === 'object' || typeof target === 'function');

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
