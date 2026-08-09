import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

/**
 * Uchta ko'rinish rejimi:
 *   light — oddiy kunduzgi
 *   sepia — uzoq o'qish uchun iliq qog'oz rangi
 *   dark  — tungi
 */
export type Theme = 'light' | 'sepia' | 'dark'

const THEMES: Theme[] = ['light', 'sepia', 'dark']

const readStoredTheme = (): Theme => {
  const stored = window.localStorage.getItem('theme')
  return THEMES.includes(stored as Theme) ? (stored as Theme) : 'light'
}

const SIDEBAR_KEY = 'sidebar-collapsed'

const readStoredSidebar = (): boolean => window.localStorage.getItem(SIDEBAR_KEY) === '1'

export interface siteState {
  /**
   * Chap menyu yig'ilganmi. Ilgari har layout buni o'z `useState` ida
   * saqlardi — sahifadan sahifaga o'tganda va yangilaganda unutilardi.
   */
  sidebarCollapsed: boolean
  theme: Theme
  /**
   * Eski kod uchun. Loyihaning ko'p joyida `isDark` o'qiladi, shuning uchun u
   * `theme` bilan birga yangilanadi. Yangi kodda `theme` ishlatilsin.
   */
  isDark: boolean
}

const initialTheme = readStoredTheme()

const initialState: siteState = {
  sidebarCollapsed: readStoredSidebar(),
  theme: initialTheme,
  isDark: initialTheme === 'dark'
}

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    /**
     * `boolean` ham qabul qilinadi: eski chaqiruvlar `setTheme(true/false)`
     * ko'rinishida yozilgan va ular ishlashda davom etsin.
     */
    setTheme: (state, action: PayloadAction<Theme | boolean>) => {
      const theme: Theme =
        typeof action.payload === 'boolean' ? (action.payload ? 'dark' : 'light') : action.payload

      window.localStorage.setItem('theme', theme)
      state.theme = theme
      state.isDark = theme === 'dark'
    },

    /** Argumentsiz — almashtiradi, `boolean` bilan — aniq holatga qo'yadi. */
    setSidebarCollapsed: (state, action: PayloadAction<boolean | undefined>) => {
      const next = action.payload ?? !state.sidebarCollapsed

      window.localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0')
      state.sidebarCollapsed = next
    }
  }
})

// Action creators are generated for each case reducer function
export const { setTheme, setSidebarCollapsed } = siteSlice.actions

export default siteSlice.reducer
