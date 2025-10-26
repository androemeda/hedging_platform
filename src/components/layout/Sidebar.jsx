import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Search
} from 'lucide-react'

export default function Sidebar() {
  const { user } = useAuth()

  const farmerLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'My Products' },
    { to: '/trade', icon: ShoppingCart, label: 'Trade' },
    { to: '/forecasts', icon: TrendingUp, label: 'Forecasts' },
  ]

  const traderLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/browse', icon: Search, label: 'Browse Products' },
    { to: '/trade', icon: ShoppingCart, label: 'Trade' },
    { to: '/forecasts', icon: TrendingUp, label: 'Forecasts' },
  ]

  const links = user?.type === 'farmer' ? farmerLinks : traderLinks

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}