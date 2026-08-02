import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface siteState {
  collapsed: boolean
  isDark: boolean
}

const initialState: siteState = {
  collapsed: false,
  isDark: window.localStorage.getItem('theme') === 'dark'
}

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      window.localStorage.setItem('theme', action.payload ? 'dark' : 'light')
      state.isDark = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setTheme } = siteSlice.actions

export default siteSlice.reducer
