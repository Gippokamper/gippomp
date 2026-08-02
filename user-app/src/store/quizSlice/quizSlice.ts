import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ITranslation {
  uz: string
  ru: string
  en: string
}

export interface quizState {
  id: number
  status: number
  openMarker: boolean
  openLab: boolean
  openInfo: boolean
  openImage: boolean
  helpType: string[]
  question: {
    type: string
    id: number
    photo: {
      photo: string
      info: string
    }
    name: ITranslation
    additional_info: ITranslation
    answers: {
      id: number
      isOpened?: boolean
      photos: string[] | null
      name: ITranslation
      description: ITranslation
      link: string
      status: number
    }[]
  }
}

export interface IQuizData {
  blockId: number
  data: quizState[] | null
}

const initialState: IQuizData = {
  blockId: 0,
  data: null
}

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<quizState[] | null>) => {
      state.data = action.payload
    },
    setOpenMarker: (state, action: PayloadAction<{ id: number }>) => {
      state.data =
        state.data &&
        state.data?.map(el =>
          el.id === action.payload.id
            ? {
                ...el,
                openMarker: !el.openMarker,
                helpType: [...el.helpType, 'marker']
              }
            : el
        )
    },
    setOpenInfo: (state, action: PayloadAction<{ id: number }>) => {
      state.data =
        state.data &&
        state.data?.map(el =>
          el.id === action.payload.id
            ? {
                ...el,
                openInfo: !el.openInfo,
                helpType: [...el.helpType, 'info']
              }
            : el
        )
    },
    setOpenLab: (state, action: PayloadAction<{ id: number }>) => {
      state.data =
        state.data &&
        state.data?.map(el =>
          el.id === action.payload.id
            ? {
                ...el,
                // status: el.status === 2 ? -1 : el.status,
                openLab: !el.openLab
              }
            : el
        )
    },
    setOpenImage: (state, action: PayloadAction<{ id: number }>) => {
      state.data =
        state.data &&
        state.data?.map(el =>
          el.id === action.payload.id
            ? {
                ...el,
                // status: el.status === 2 ? -1 : el.status,
                openImage: !el.openImage,
                helpType: [...el.helpType, 'img']
              }
            : el
        )
    },
    selectAnswer: (state, action: PayloadAction<{ id: number; answerId: number }>) => {
      state.data = state.data
        ? state.data?.map(el =>
            el.id === action.payload.id
              ? {
                  ...el,
                  status:
                    el.status === 2
                      ? el.helpType?.length
                        ? Number(
                            el?.question?.answers?.find(item => item?.id === action?.payload?.answerId)?.status
                          ) === 1
                          ? -1
                          : 0
                        : Number(el?.question?.answers?.find(item => item?.id === action?.payload?.answerId)?.status)
                      : el?.status,
                  question: {
                    ...el?.question,
                    answers: el?.question?.answers?.map(ans =>
                      ans?.id === action?.payload?.answerId
                        ? {
                            ...ans,
                            isOpened: true
                          }
                        : ans
                    )
                  }
                }
              : el
          )
        : null
    },
    setBlockId: (state, action: PayloadAction<number>) => {
      state.blockId = action.payload
    },
    setOpenAnswers: (
      state,
      action: PayloadAction<{
        id: number
        isOpen: boolean
      }>
    ) => {
      state.data =
        state?.data &&
        state.data?.map(item =>
          item?.id === action?.payload.id
            ? {
                ...item,
                question: {
                  ...item.question,
                  answers: item.question?.answers?.map(el => {
                    return { ...el, isOpened: action.payload.isOpen }
                  })
                }
              }
            : item
        )
    },
    setRestartQuiz: (state, action: PayloadAction<number>) => {
      state.data =
        state?.data &&
        state.data?.map(item =>
          item?.id === action?.payload
            ? {
                ...item,
                status: 2,
                openMarker: false,
                openLab: false,
                openInfo: false,
                openImage: false,
                helpType: [],
                question: {
                  ...item.question,
                  answers: item.question?.answers?.map(el => {
                    return { ...el, isOpened: false }
                  })
                }
              }
            : item
        )
    },
    setResetBlockId: state => {
      state.blockId = 0
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setData,
  selectAnswer,
  setBlockId,
  setOpenInfo,
  setOpenLab,
  setOpenMarker,
  setOpenAnswers,
  setRestartQuiz,
  setResetBlockId,
  setOpenImage
} = quizSlice.actions

export default quizSlice.reducer
