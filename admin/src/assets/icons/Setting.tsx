import * as React from 'react'
import { SVGProps } from 'react'
const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} fill='none' {...props}>
    <path
      stroke='#323232'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M4.506 10.698v0a2.719 2.719 0 0 1-.32-3.163l.04-.07a2.719 2.719 0 0 1 2.9-1.304h0c.47.096.959.017 1.374-.223v0c.415-.24.729-.624.88-1.079v0A2.719 2.719 0 0 1 11.96 3h.08c1.17 0 2.21.749 2.58 1.86v0c.151.454.465.838.88 1.078v0c.415.24.904.319 1.374.223h0a2.719 2.719 0 0 1 2.9 1.304l.04.07a2.719 2.719 0 0 1-.32 3.163v0A1.962 1.962 0 0 0 19 12v0c0 .48.176.943.494 1.302v0c.776.875.905 2.15.32 3.163l-.04.07a2.719 2.719 0 0 1-2.9 1.304h0a1.962 1.962 0 0 0-1.374.223v0c-.415.24-.729.624-.88 1.079v0A2.719 2.719 0 0 1 12.04 21h-.08c-1.17 0-2.21-.749-2.58-1.86v0a1.962 1.962 0 0 0-.88-1.078v0a1.962 1.962 0 0 0-1.374-.223h0a2.719 2.719 0 0 1-2.9-1.304l-.04-.07a2.719 2.719 0 0 1 .32-3.163v0C4.824 12.942 5 12.48 5 12v0c0-.48-.176-.943-.494-1.302Z'
      clipRule='evenodd'
    />
    <circle cx={12} cy={12} r={3} stroke='#323232' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} />
  </svg>
)
export default SettingsIcon
