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

export interface siteState {
  collapsed: boolean
  theme: Theme
  /**
   * Eski kod uchun. Loyihaning ko'p joyida `isDark` o'qiladi, shuning uchun u
   * `theme` bilan birga yangilanadi. Yangi kodda `theme` ishlatilsin.
   */
  isDark: boolean
}

const initialTheme = readStoredTheme()

const initialState: siteState = {
  collapsed: false,
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
    }
  }
})

// Action creators are generated for each case reducer function
export const { setTheme } = siteSlice.actions

export default siteSlice.reducer
