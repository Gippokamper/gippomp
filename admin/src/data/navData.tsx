import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import BarChartIcon from '@mui/icons-material/BarChart'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import TranslateIcon from '@mui/icons-material/Translate'
import ImageIcon from '@mui/icons-material/Image'
import HandshakeIcon from '@mui/icons-material/Handshake'
import CategoryIcon from '@mui/icons-material/Category'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import PolicyIcon from '@mui/icons-material/Policy'
import QuizIcon from '@mui/icons-material/Quiz'
import { Biotech, CastForEducation, FolderSpecial, Newspaper, VideoSettings } from '@mui/icons-material'
import { ReactElement } from 'react'

export interface INavItem {
  text: string
  link: string
  icon: ReactElement
  /** NavLink faqat aniq mos kelganda faol bo'lishi kerak bo'lsa (masalan "/") */
  end?: boolean
}

export interface INavSection {
  title?: string
  items: INavItem[]
}

// Menyu bo'limlarga ajratildi. Ilgari bitta uzun ro'yxat edi va "Settings"
// elementi mavjud bo'lmagan /settings manziliga olib borardi (bo'sh sahifa).
export const navSections: INavSection[] = [
  {
    items: [{ text: 'Home', link: '/', icon: <HomeIcon />, end: true }]
  },
  {
    // Yangi drill-down modullar. Eski alohida sahifalar (Category/Articles/Notes/
    // Images/Video category/Videos, Question Folders/Quizzes, Study Plan...)
    // menyudan olib tashlandi — ular hali route sifatida bor (URL orqali
    // ochiladi), kerak bo'lmasa keyin butunlay o'chiriladi.
    title: 'Kontent',
    items: [
      { text: 'Kontent', link: '/content', icon: <LibraryBooksIcon /> },
      { text: 'Videolar', link: '/video-content', icon: <VideoSettings /> },
      { text: 'News', link: '/news', icon: <Newspaper /> },
      { text: 'Labs', link: '/labs', icon: <Biotech /> }
    ]
  },
  {
    title: 'Testlar',
    items: [
      { text: 'Savol papkalari (QBank)', link: '/qbank', icon: <FolderSpecial /> },
      { text: 'Testlar', link: '/quiz-content', icon: <QuizIcon /> }
    ]
  },
  {
    title: "O'quv rejasi",
    items: [{ text: "O'quv rejalari", link: '/plan-content', icon: <CastForEducation /> }]
  },
  {
    title: 'Foydalanuvchilar',
    items: [
      { text: 'Users', link: '/users', icon: <PeopleAltIcon /> },
      { text: 'Tariffs', link: '/tariffs', icon: <BarChartIcon /> },
      { text: 'Messages', link: '/messages?type=messages_to', icon: <ForwardToInboxIcon /> }
    ]
  },
  {
    title: 'Sozlamalar',
    items: [
      { text: 'Translations', link: '/settings/translations', icon: <TranslateIcon /> },
      { text: 'Landing images', link: '/settings/images', icon: <ImageIcon /> },
      { text: 'Partners', link: '/settings/partners', icon: <HandshakeIcon /> },
      { text: 'Landing categories', link: '/settings/categories', icon: <CategoryIcon /> },
      { text: 'Landing videos', link: '/settings/videos', icon: <OndemandVideoIcon /> },
      { text: 'FAQ', link: '/settings/questions', icon: <HelpOutlineIcon /> },
      { text: 'Privacy policy', link: '/settings/privacy-policy', icon: <PolicyIcon /> }
    ]
  }
]
