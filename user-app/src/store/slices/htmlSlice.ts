import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type IFeedback = {
  article_slug?: string
  chapter_id?: number
  block_id?: number
  question_id?: number
  type: string
} | null

export interface htmlState {
  fontSize: number
  chapters: any[]
  showMarker: boolean
  showAddInfo: boolean
  photo: {
    type: 'image' | 'video' | 'quiz'
    url: string
  } | null
  feedback: IFeedback
  lang: 'uz' | 'ru' | 'en'
}

/**
 * O'quvchi sozlamalari brauzerda saqlanadi: har safar maqolaga kirganda
 * shrift o'lchamini, marker va qo'shimcha ma'lumot rejimini qaytadan
 * sozlashga to'g'ri kelmasin.
 */
export const READER_SETTINGS_KEY = 'reader-settings'

interface IReaderSettings {
  fontSize: number
  showMarker: boolean
  showAddInfo: boolean
}

const DEFAULT_READER_SETTINGS: IReaderSettings = {
  fontSize: 16,
  showMarker: false,
  showAddInfo: false
}

function loadReaderSettings(): IReaderSettings {
  try {
    const raw = window.localStorage.getItem(READER_SETTINGS_KEY)
    if (!raw) {
      return DEFAULT_READER_SETTINGS
    }
    const parsed = JSON.parse(raw)
    return {
      // Saqlangan qiymat buzilgan bo'lsa ham ilova ishlashda davom etsin.
      fontSize:
        typeof parsed?.fontSize === 'number' && parsed.fontSize >= 10 && parsed.fontSize <= 30
          ? parsed.fontSize
          : DEFAULT_READER_SETTINGS.fontSize,
      showMarker: !!parsed?.showMarker,
      showAddInfo: !!parsed?.showAddInfo
    }
  } catch (e) {
    return DEFAULT_READER_SETTINGS
  }
}

const initialState: htmlState = {
  ...loadReaderSettings(),
  chapters: [],
  photo: null,
  feedback: null,
  lang: 'uz'
}

export const htmlSlice = createSlice({
  name: 'html',
  initialState,
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      if (state.fontSize < 30) {
        state.fontSize += 1
      }
    },
    decrement: state => {
      if (state.fontSize > 10) {
        state.fontSize -= 1
      }
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload
    },
    setChapters: (state, action: PayloadAction<any>) => {
      state.chapters = action.payload?.map((el: any) => {
        return {
          ...el,
          isOpen: false
        }
      })
    },
    toggleChapter: (state, action: PayloadAction<number>) => {
      state.chapters = state.chapters?.map((chapter, index) =>
        index === action.payload ? { ...chapter, isOpen: !chapter?.isOpen } : chapter
      )
    },
    openChapter: (state, action: PayloadAction<number>) => {
      state.chapters = state.chapters?.map(chapter =>
        chapter?.id === action.payload ? { ...chapter, isOpen: true } : chapter
      )
    },
    toggleAllChapter: (state, action: PayloadAction<boolean>) => {
      state.chapters = state.chapters?.map((chapter, index) => {
        return { ...chapter, isOpen: action.payload }
      })
    },
    toggleShowMarker: state => {
      state.showMarker = !state.showMarker
    },
    toggleAddInfo: state => {
      state.showAddInfo = !state.showAddInfo
    },
    setPhoto: (
      state,
      action: PayloadAction<{
        type: 'image' | 'video' | 'quiz'
        url: string
      }>
    ) => {
      state.photo = {
        type: action.payload.type,
        url: action.payload.url
      }
    },
    setClosePhoto: state => {
      state.photo = null
    },
    // `resetFontSize` olib tashlandi: u reducer ichida getComputedStyle
    // chaqirardi (reducer'lar toza bo'lishi kerak) va sahifadan chiqilganda
    // shrift o'lchamini nolga qaytarardi — endi sozlama saqlanadi.
    setFeedback: (state, action: PayloadAction<IFeedback>) => {
      state.feedback = action.payload
    },
    setLang: (state, action: PayloadAction<'uz' | 'ru' | 'en'>) => {
      state.lang = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  setFontSize,
  setChapters,
  toggleChapter,
  toggleAllChapter,
  toggleShowMarker,
  toggleAddInfo,
  openChapter,
  setPhoto,
  setClosePhoto,
  setLang
} = htmlSlice.actions

export default htmlSlice.reducer
