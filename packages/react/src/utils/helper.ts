/**
 * 判断是否是系统标签
 *
 * @param c 组件
 */
export const isSystemType = (c: any) =>
    typeof c === 'string' || typeof c?.type === 'string';
