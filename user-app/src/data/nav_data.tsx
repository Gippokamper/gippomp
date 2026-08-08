import LibraryIcon from '../img/icons/LibraryIcon'
import NewsIcon from '../img/icons/NewsIcon'
import StudyIcon from '../img/icons/StudyIcon'
import TestIcon from '../img/icons/TestIcon'
import VediosIcon from '../img/icons/VediosIcon'

/*
 * Chap menyu — faqat o'quv modullari.
 *
 * Shaxsiy kabinet, yordam markazi va tungi rejim bu yerdan olib tashlandi:
 * ular yuqori o'ng burchakdagi profil menyusiga ko'chirildi (layouts/navbar).
 * O'quv reja esa modullarning eng oxirida turadi. Saqlanganlar ham yuqorida —
 * bildirishnoma tugmasining chapida.
 */
export const nav_data = [
  {
    to: '/library',
    text: 'Library',
    icon: <LibraryIcon />
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
    to: '/study-plan',
    text: 'Educational program',
    icon: <StudyIcon />
  }
]
