import { configureStore } from '@reduxjs/toolkit'
import htmlReducer, { READER_SETTINGS_KEY } from './slices/htmlSlice'
import quizReducer from './quizSlice/quizSlice'
import siteReducer from './siteSlice/siteSlice'

export const store = configureStore({
  reducer: {
    html: htmlReducer,
    quiz: quizReducer,
    site: siteReducer
  }
})

// O'quvchi sozlamalarini saqlab boramiz. Reducer'lar ichida yozmaymiz —
// ular toza (side-effect'siz) qolishi kerak, shuning uchun obuna orqali.
let lastPersisted = ''
store.subscribe(() => {
  const { fontSize, showMarker, showAddInfo } = store.getState().html
  const next = JSON.stringify({ fontSize, showMarker, showAddInfo })
  if (next === lastPersisted) {
    return
  }
  lastPersisted = next
  try {
    window.localStorage.setItem(READER_SETTINGS_KEY, next)
  } catch (e) {
    // Private rejimda localStorage yozishga ruxsat bo'lmasligi mumkin —
    // bu ilovani to'xtatmasligi kerak.
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
