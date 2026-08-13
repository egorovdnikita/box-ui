import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { IconStyle } from './types';

const IconStyleContext = createContext<IconStyle>('linear');

/**
 * Mirrors the `icon-style` variable of the `Icon` collection in
 * `Box UI | Icons`: set it once and every `<Icon>` underneath follows.
 */
export function IconStyleProvider({ style, children }: { style: IconStyle; children: ReactNode }) {
  const value = useMemo(() => style, [style]);
  return <IconStyleContext.Provider value={value}>{children}</IconStyleContext.Provider>;
}

export function useIconStyle(): IconStyle {
  return useContext(IconStyleContext);
}

export { IconStyleContext };
