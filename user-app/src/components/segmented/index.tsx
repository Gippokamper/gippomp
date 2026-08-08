import React from 'react'
import './segmented.scss'

export interface ISegment {
  value: string
  /** Ekran o'quvchilari va tooltip uchun — ekranda ko'rinmaydi. */
  label: string
  icon: React.ReactNode
}

interface IProps {
  options: ISegment[]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
}

/**
 * Faqat belgilardan iborat almashtirgich: tanlangan variant ostidagi oq
 * "polzunok" bir holatdan ikkinchisiga silliq suriladi.
 *
 * Matn olib tashlangan, lekin `title` va `aria-label` da qoladi — sichqoncha
 * ustiga borsa ko'rinadi, ekran o'quvchisi ham o'qiy oladi.
 */
function Segmented({ options, value, onChange, ariaLabel }: IProps) {
  const index = Math.max(0, options.findIndex(option => option.value === value))

  return (
    <div
      className='seg'
      role='group'
      aria-label={ariaLabel}
      style={{ ['--seg-count' as any]: options.length, ['--seg-index' as any]: index }}
    >
      {/* Suriluvchi ko'rsatkich — tugmalar ostida turadi. */}
      <span className='seg__thumb' aria-hidden='true' />

      {options.map(option => (
        <button
          key={option.value}
          type='button'
          className={`seg__btn ${option.value === value ? 'is-active' : ''}`}
          aria-pressed={option.value === value}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
        </button>
      ))}
    </div>
  )
}

export default Segmented
