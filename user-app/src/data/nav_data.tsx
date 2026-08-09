import type { ReactNode } from 'react'

import HomeIcon from '../img/icons/HomeIcon'
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
 *
 * Bu ro'yxat — navigatsiyaning YAGONA manbasi. Uni `layouts/sidebar` (barcha
 * to'rt layout uchun) va mobil menyu o'qiydi; boshqa joyda havolalar qo'lda
 * yozilmasin.
 */

export interface NavItem {
  /**
   * Barqaror kalit. `to` emas: yo'l o'zgarishi mumkin, id esa tugmalar
   * birikmasi va sozlamalarda saqlanadigan nom sifatida qoladi.
   */
  id: string
  to: string
  /** i18n kaliti — chizishdan oldin `t()` dan o'tkaziladi. */
  text: string
  icon: ReactNode
}

export const nav_data: NavItem[] = [
  {
    id: 'home',
    to: '/home',
    text: 'Home',
    icon: <HomeIcon />
  },
  {
    id: 'library',
    to: '/library',
    text: 'Library',
    icon: <LibraryIcon />
  },
  {
    id: 'quizzes',
    to: '/quizzes',
    text: 'Test your knowledge',
    icon: <TestIcon />
  },
  {
    id: 'videos',
    to: '/videos',
    text: 'Videos',
    icon: <VediosIcon />
  },
  {
    id: 'news',
    to: '/news',
    text: 'News',
    icon: <NewsIcon />
  },
  {
    id: 'study-plan',
    to: '/study-plan',
    text: 'Educational program',
    icon: <StudyIcon />
  }
]
