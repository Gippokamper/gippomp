import LibraryIcon from '../img/icons/LibraryIcon'
import NewsIcon from '../img/icons/NewsIcon'
import StudyIcon from '../img/icons/StudyIcon'
import TestIcon from '../img/icons/TestIcon'
import VediosIcon from '../img/icons/VediosIcon'

/** Saqlanganlar — xatcho'p belgisi. */
const SavedIcon = () => (
  <svg width={24} height={24} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d='M6.5 4.5h11a1 1 0 0 1 1 1v14.2a.6.6 0 0 1-.94.5L12 16.4l-5.56 3.8a.6.6 0 0 1-.94-.5V5.5a1 1 0 0 1 1-1Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

/*
 * Chap menyu — faqat o'quv modullari.
 *
 * Shaxsiy kabinet, yordam markazi va tungi rejim bu yerdan olib tashlandi:
 * ular yuqori o'ng burchakdagi profil menyusiga ko'chirildi (layouts/navbar).
 * O'quv reja esa modullarning eng oxirida turadi.
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
    to: '/saved',
    text: 'Saved',
    icon: <SavedIcon />
  },
  {
    to: '/study-plan',
    text: 'Educational program',
    icon: <StudyIcon />
  }
]
