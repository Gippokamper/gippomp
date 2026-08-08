import React from 'react'
import SunIcon from '../img/icons/SunIcon'
import MoonIcon from '../img/icons/MoonIcon'
import type { Theme } from '../store/siteSlice/siteSlice'

/** Ochiq kitob — "o'qish" rejimining belgisi. */
export const ReadingIcon = () => (
  <svg width={20} height={20} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d='M12 6.5C10.5 5.2 8.6 4.6 6 4.6a.9.9 0 0 0-.9.9v11c0 .5.4.9.9.9 2.6 0 4.5.6 6 1.9 1.5-1.3 3.4-1.9 6-1.9.5 0 .9-.4.9-.9v-11a.9.9 0 0 0-.9-.9c-2.4 0-4.5.6-6 1.9Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path d='M12 6.5v12.8' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
  </svg>
)

/*
 * Ko'rinish rejimlari. Ikki joyda ishlatiladi — yuqoridagi profil menyusida va
 * maqola o'qish sozlamalarida — shuning uchun bir joyda saqlanadi.
 */
export const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'sepia', label: 'Reading', icon: <ReadingIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> }
]
