import { t } from 'i18next'
import AccountIcon from '../img/icons/AccountIcon'
import HelpIcon from '../img/icons/HelpIcon'
import LibraryIcon from '../img/icons/LibraryIcon'
import NewsIcon from '../img/icons/NewsIcon'
import StudyIcon from '../img/icons/StudyIcon'
import TestIcon from '../img/icons/TestIcon'
import VediosIcon from '../img/icons/VediosIcon'

export const nav_data = [
  {
    to: '/library',
    text: 'Library',
    icon: <LibraryIcon />
  },
  {
    to: '/study-plan',
    text: 'Educational program',
    icon: <StudyIcon />
  },
  {
    to: '/quizzes',
    text: 'Test your knowledge',
    icon: <TestIcon />
  },
  {
    to: '/videos',
    text: 'Videos',
    icon: <VediosIcon />
  },
  {
    to: '/news',
    text: 'News',
    icon: <NewsIcon />
  },
  {
    to: '/account',
    text: 'Personal cabinet',
    icon: <AccountIcon />
  },
  {
    to: '/help',
    text: 'Help center',
    icon: <HelpIcon />
  }
]
