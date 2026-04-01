import { ActivityType } from '../../types'

interface Props {
  activity: ActivityType
  size?: number
  className?: string
}

export default function ActivityIcon({ activity, size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={activity}
    >
      {ICONS[activity]}
    </svg>
  )
}

const ICONS: Record<ActivityType, React.ReactNode> = {
  running: (
    <>
      {/* Head */}
      <circle cx="15" cy="4.5" r="1.5" />
      {/* Body leaning forward */}
      <line x1="13.5" y1="6" x2="10" y2="12" />
      {/* Front arm swinging back */}
      <line x1="13" y1="8.5" x2="9" y2="6.5" />
      {/* Back arm swinging forward */}
      <line x1="12" y1="9.5" x2="15.5" y2="11" />
      {/* Front leg forward */}
      <path d="M10 12 L13 18 L15.5 18" />
      {/* Back leg back / lifted */}
      <path d="M10 12 L7.5 16 L5 15.5" />
    </>
  ),

  cycling: (
    <>
      {/* Left wheel */}
      <circle cx="6.5" cy="16.5" r="4" />
      {/* Right wheel */}
      <circle cx="17.5" cy="16.5" r="4" />
      {/* Frame: bottom bracket → seat stay → rear wheel */}
      <path d="M13.5 16.5 L11 9 L17.5 16.5" />
      {/* Frame: bottom bracket → down tube → front wheel */}
      <line x1="13.5" y1="16.5" x2="6.5" y2="16.5" />
      {/* Seat tube */}
      <line x1="11" y1="9" x2="13.5" y2="16.5" />
      {/* Handlebar */}
      <path d="M11 9 L14.5 8 L16 9" />
      {/* Saddle */}
      <line x1="9" y1="8.5" x2="12" y2="8.5" />
      {/* Rider head */}
      <circle cx="15.5" cy="6.5" r="1.5" />
      {/* Rider body */}
      <line x1="15.5" y1="8" x2="14" y2="9" />
    </>
  ),

  rowing: (
    <>
      {/* Boat hull */}
      <path d="M2 15 Q12 20 22 15" />
      {/* Gunwale (top of boat) */}
      <path d="M4 13.5 Q12 15 20 13.5" />
      {/* Rower head */}
      <circle cx="12" cy="8" r="1.5" />
      {/* Rower body */}
      <line x1="12" y1="9.5" x2="12" y2="13.5" />
      {/* Left oar */}
      <line x1="10" y1="11.5" x2="3" y2="13" />
      {/* Right oar */}
      <line x1="14" y1="11.5" x2="21" y2="13" />
      {/* Oar blades */}
      <line x1="2.5" y1="12.5" x2="3.5" y2="13.5" />
      <line x1="20.5" y1="12.5" x2="21.5" y2="13.5" />
    </>
  ),

  swimming: (
    <>
      {/* Head */}
      <circle cx="5" cy="9" r="1.5" />
      {/* Body horizontal */}
      <line x1="6.5" y1="9" x2="13" y2="9" />
      {/* Reaching arm forward */}
      <line x1="13" y1="9" x2="18" y2="6.5" />
      {/* Kick legs */}
      <path d="M13 9 L10 13" />
      <path d="M13 9 L17 12" />
      {/* Water wave 1 */}
      <path d="M2 16 C4 14, 6 18, 8 16 C10 14, 12 18, 14 16 C16 14, 18 18, 20 16" />
      {/* Water wave 2 */}
      <path d="M2 19.5 C4 17.5, 6 21.5, 8 19.5 C10 17.5, 12 21.5, 14 19.5 C16 17.5, 18 21.5, 20 19.5" />
    </>
  ),

  elliptical: (
    <>
      {/* Head */}
      <circle cx="12" cy="3.5" r="1.5" />
      {/* Body */}
      <line x1="12" y1="5" x2="12" y2="10.5" />
      {/* Left handle arm */}
      <line x1="12" y1="7.5" x2="7" y2="5.5" />
      {/* Right handle arm */}
      <line x1="12" y1="7.5" x2="17" y2="5.5" />
      {/* Left pedal path (ellipse) */}
      <ellipse cx="8.5" cy="17" rx="3" ry="1.5" />
      {/* Right pedal path (ellipse) */}
      <ellipse cx="15.5" cy="17" rx="3" ry="1.5" />
      {/* Left leg */}
      <path d="M12 10.5 L9 15.5" />
      {/* Right leg */}
      <path d="M12 10.5 L15 15.5" />
    </>
  ),

  hiit: (
    <>
      {/* Lightning bolt */}
      <path d="M13 2 L7 13 L12 13 L11 22 L17 11 L12 11 Z" />
    </>
  ),

  walking: (
    <>
      {/* Head */}
      <circle cx="12" cy="4" r="1.5" />
      {/* Body upright */}
      <line x1="12" y1="5.5" x2="12" y2="13" />
      {/* Front arm swinging forward */}
      <line x1="12" y1="9" x2="8.5" y2="12" />
      {/* Back arm */}
      <line x1="12" y1="9" x2="15.5" y2="11" />
      {/* Front leg striding forward */}
      <path d="M12 13 L9.5 18 L7.5 21" />
      {/* Back leg */}
      <path d="M12 13 L14.5 18 L16 21" />
    </>
  ),

  custom: (
    <>
      {/* 4-line asterisk */}
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
    </>
  ),
}
