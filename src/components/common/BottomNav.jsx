import { NavLink, useLocation } from 'react-router-dom'
import { Heart, Home, Ticket, UserRound } from 'lucide-react'

const items = [
  { to: '/', icon: Home, label: 'Home', match: (path) => path === '/' || path.startsWith('/movies') },
  { to: '/tickets', icon: Ticket, label: 'Tickets', match: (path) => path.startsWith('/tickets') },
  { to: '/favorites', icon: Heart, label: 'Favorites', match: (path) => path.startsWith('/favorites') },
  { to: '/profile', icon: UserRound, label: 'Profile', match: (path) => path.startsWith('/profile') },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 h-[72px] border-t border-slate-100 bg-white">
      <div className="grid h-full grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          const active = item.match(pathname)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className="flex items-center justify-center"
            >
              <Icon
                size={26}
                strokeWidth={active ? 2.1 : 1.8}
                className={active ? 'text-brand' : 'text-slate-400'}
              />
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
