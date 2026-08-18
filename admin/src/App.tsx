import React from 'react'
import './App.css'
import MainLayout from './layouts/main'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Users from './pages/users'
import Category from './pages/category'
import Articles from './pages/articles'
import Chapter from './pages/chapter'
import Comments from './pages/comments'
import Images from './pages/images'
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
import ErrorBoundary from './components/error-boundary'
import NotFound from './pages/not-found'

function WithLayout() {
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
          <Route path='category' element={<Category />} />
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
          <Route path='study-plans' element={<StudyPlans />} />
          <Route path='study-plan' element={<StudyPlan />} />
          <Route path='news-create' element={<NewsForm />} />
          <Route path='quizzes' element={<Quizzes />} />
          <Route path='quizzes-category' element={<QuizzesCategory />} />
          <Route path='labs' element={<Labs />} />
          <Route path='labs-create' element={<LabsForm />} />
          {/* Menyudagi "Sozlamalar" bo'limi endi bo'sh sahifa emas — birinchi bo'limga olib boradi */}
          <Route path='settings' element={<Navigate to='/settings/translations' replace />} />
          <Route path='settings/translations' element={<Translations />} />
          <Route path='settings/images' element={<LandingImages />} />
          <Route path='settings/partners' element={<Partners />} />
          <Route path='settings/categories' element={<LandingCategories />} />
          <Route path='settings/videos' element={<LandingVideos />} />
          <Route path='settings/questions' element={<FAQ />} />
          <Route path='settings/privacy-policy' element={<PrivacyPolicy />} />
          {/* Noto'g'ri manzil oq ekran emas, tushunarli sahifa ko'rsatadi */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </MainLayout>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='*' element={<WithLayout />} />
      </Routes>

      <Toaster position='top-right' />
    </>
  )
}

export default App
