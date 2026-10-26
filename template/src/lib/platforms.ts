/** 多平台竖屏版本的排版参数，说明见 references/平台规范.md。
 *  画面按抖音写（内容 y 236–1450、x 54–1026，字幕 y 1470），其他平台在 Promo 里整体缩放、平移。 */
export type Platform = "douyin" | "xhs" | "wx";

export type PlatformLayout = {
  /** 内容缩放 */
  s: number;
  /** 内容顶边（缩放以 x 540、y 236 为原点） */
  top: number;
  /** 字幕单独摆放的位置；不填就跟着内容一起缩放平移 */
  sub?: { left: number; width: number; top: number; size: number };
};

export const PLATFORMS: Record<Platform, PlatformLayout> = {
  douyin: { s: 1, top: 236 },
  // 小红书在长屏手机上铺满屏幕高度，左右各裁约 100px；顶部返回/搜索到 y≈230，底部账号栏从 y≈1560 起
  xhs: { s: 0.86, top: 280, sub: { left: 120, width: 840, top: 1440, size: 50 } },
  // 视频号底部有文案和浮评，内容和字幕整体上移
  wx: { s: 1, top: 196 },
};

/** 内容层的 transform，套在所有场景外面 */
export const platformTransform = (p: Platform) => `translateY(${PLATFORMS[p].top - 236}px) scale(${PLATFORMS[p].s})`;
