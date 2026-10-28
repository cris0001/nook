export const IS_MAC = /mac|iphone|ipad/i.test(navigator.userAgent);
export const MOD = IS_MAC ? '⌘' : 'Ctrl';
export const SHIFT = IS_MAC ? '⇧' : 'Shift';

export const shortcut = (...keys: string[]) => keys.join(IS_MAC ? '' : '+');
