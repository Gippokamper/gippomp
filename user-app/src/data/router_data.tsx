import { PageNotFound } from '../pages/404'
import { Account } from '../pages/account'
import ForgotPassword from '../pages/forgot-password'
import { Help } from '../pages/help'
import { Home } from '../pages/home'
import { LibraryDetail } from '../pages/library_detail'
import { News } from '../pages/news'
import { NewsSingle } from '../pages/news_single'
import Quizzes from '../pages/quizzes'
import SendCode from '../pages/send_code'
import SignIn from '../pages/sign_in'
import { SignUp } from '../pages/sign_up'
import { Saved } from '../pages/saved'
import { Stats } from '../pages/stats'
import StudyPlan from '../pages/study_plan'
import StudyPlanSingle from '../pages/study_plan_single'
import StudyTest from '../pages/study_test'
import { Videos } from '../pages/videos'

export const router_data = [
  {
    path: '/library/*',
    element: <Home />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/sign-in',
    element: <SignIn />
  },
  {
    path: '/article/:id',
    element: <LibraryDetail />
  },
  {
    path: '/study-plan/*',
    element: <StudyPlan />
  },

  {
    path: '/quizzes/*',
    element: <Quizzes />
  },
  {
    path: '/detail/:type/:studySlug',
    element: <StudyPlanSingle />
  },
  {
    path: '/detail/:type/:studySlug/:test_id',
    element: <StudyTest />
  },
  {
    path: '/detail/:type/:studySlug/:test_id/stats',
    element: <Stats />
  },
  {
    path: '/videos/*',
    element: <Videos />
  },
  {
    path: '/saved',
    element: <Saved />
  },
  {
    path: '/news',
    element: <News />
  },
  {
    path: '/news/:news_id',
    element: <NewsSingle />
  },
  {
    path: '/account',
    element: <Account />
  },
  {
    path: '/help',
    element: <Help />
  },
  {
    path: '/send-code',
    element: <SendCode />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '*',
    element: <PageNotFound />
  }
]
