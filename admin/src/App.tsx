import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import MainLayout from './layouts/main'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Users from './pages/users'
import Category from './pages/category'
import CategoryList from './pages/category-list'
import User from './pages/user'
import Articles from './pages/articles'
import Chapter from './pages/chapter'
import Comments from './pages/comments'
import Images from './pages/images'
import CommentsForm from './pages/comments/components/form'
import Tariffs from './pages/tariffs'
import Messages from './pages/messages'
import Translations from './pages/translations'
import Login from './pages/login'
import ImagesForm from './pages/images/form'
import VideoCategory from './pages/video-category'
import Videos from './pages/videos'
import News from './pages/news'
import NewsForm from './pages/news/components/form/NewsForm'
import QuestionFolder from './pages/question-folder'
import { TableFilterProvider } from './context/TableFilterContext'
import StudyPlans from './pages/study-plan-category'
import StudyPlan from './pages/study-plan'
import { Toaster } from 'react-hot-toast'
import Quizzes from './pages/quizzes'
import QuizzesCategory from './pages/quizzes-category'
import Labs from './pages/labs'
import LabsForm from './pages/labs/components/form/NewsForm'
import ChildFolder from './pages/question-folder/child-folder'
import Questions from './pages/question-folder/child-folder/folder'
import QuestionsForm from './pages/question-folder/child-folder/folder/form'
import LandingImages from './pages/landing-images'
import Partners from './pages/partners'
import LandingVideos from './pages/landing-videos'
import LandingCategories from './pages/landing-categories'
import FAQ from './pages/FAQ'
import PrivacyPolicy from './pages/privacy-policy'
import { useLocation } from 'react-router-dom'
import ErrorBoundary from './components/error-boundary'

function useForceUpdate() {
  const [value, setValue] = useState(0) // integer state
  return () => setValue(value => value + 1) // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

function App() {
  const innerWidth = window.innerWidth
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const handleResize = () => {
      const root = getComputedStyle(document.documentElement)
      console.log('CURRENT FONT SIZE: ', root.getPropertyValue('--base-font-size'), window.innerWidth)

      const fontSize = (16 * innerWidth) / 1920
      const fontSizeSmall = (16 * innerWidth) / 600

      // set css variable value
      if (innerWidth > 600) {
        document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`)
      } else {
        document.documentElement.style.setProperty('--base-font-size', `${fontSizeSmall}px`)
      }
      forceUpdate()
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [innerWidth])
  const WithLayout = () => {
    const location = useLocation()
    // Auth guard: token bo'lmasa admin panel ko'rsatilmaydi, login'ga yo'naltiriladi.
    if (!localStorage.getItem('accessToken')) {
      return <Navigate to='/login' replace />
    }
    return (
    <MainLayout>
      {/* Sahifa crash bo'lsa layout (menyu) qoladi, faqat kontent xato ko'rsatadi; sahifa o'zgarsa reset bo'ladi */}
      <ErrorBoundary resetKey={location.pathname}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='users' element={<Users />} />
        <Route path='users/:id' element={<User />} />
        <Route path='category' element={<Category />} />
        <Route path='category-list' element={<CategoryList />} />
        <Route path='articles' element={<Articles />} />
        <Route path='chapter' element={<Chapter />} />
        <Route path='comments' element={<Comments />} />
        <Route path='images' element={<Images />} />
        <Route path='images-edit' element={<ImagesForm />} />
        <Route path='tariffs' element={<Tariffs />} />
        <Route path='messages' element={<Messages />} />
        <Route path='video-category' element={<VideoCategory />} />
        <Route path='videos' element={<Videos />} />
        <Route path='news' element={<News />} />
        <Route path='question-folder' element={<QuestionFolder />} />
        <Route path='question-folder/:parent' element={<ChildFolder />} />
        <Route path='question-folder/:parent/:folder' element={<Questions />} />
        <Route path='question-folder/:parent/:folder/edit' element={<QuestionsForm />} />
        {/* <Route path='questions' element={<Questions />} /> */}
        {/* <Route path='questions-create' element={<QuestionsForm />} /> */}
        <Route path='study-plans' element={<StudyPlans />} />
        <Route path='study-plan' element={<StudyPlan />} />
        <Route path='news-create' element={<NewsForm />} />
        <Route path='quizzes' element={<Quizzes />} />
        <Route path='quizzes-category' element={<QuizzesCategory />} />
        <Route path='labs' element={<Labs />} />
        <Route path='labs-create' element={<LabsForm />} />
        <Route path='settings/translations' element={<Translations />} />
        <Route path='settings/images' element={<LandingImages />} />
        <Route path='settings/partners' element={<Partners />} />
        <Route path='settings/categories' element={<LandingCategories />} />
        <Route path='settings/videos' element={<LandingVideos />} />
        <Route path='settings/questions' element={<FAQ />} />
        <Route path='settings/privacy-policy' element={<PrivacyPolicy />} />
      </Routes>
      </ErrorBoundary>
    </MainLayout>
    )
  }
  return (
    <TableFilterProvider>
      <Routes>
        <Route path='*' element={<WithLayout />} />
        <Route path='login' element={<Login />} />
      </Routes>

      <Toaster />
    </TableFilterProvider>
  )
}

export default App
