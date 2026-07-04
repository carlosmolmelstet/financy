import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { FinancyLogo } from '../brand/FinancyLogo'
import { IconButton } from '../ui'
import type { AuthUser } from '../../graphql/auth'
import { clearAuthToken } from '../../lib/auth-session'
import { cn } from '../../lib/class-names'
import './authenticated-layout.css'

export type AuthenticatedRouteKey = 'dashboard' | 'transactions' | 'categories'

type AuthenticatedLayoutProps = {
  activeRoute: AuthenticatedRouteKey
  children: ReactNode
  user: AuthUser
}

const navItems: Array<{
  href: string
  key: AuthenticatedRouteKey
  label: string
}> = [
  { href: '/dashboard', key: 'dashboard', label: 'Dashboard' },
  { href: '/transacoes', key: 'transactions', label: 'Transações' },
  { href: '/categorias', key: 'categories', label: 'Categorias' },
]

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return 'US'
  }

  const firstInitial = parts[0]?.[0] ?? ''
  const lastInitial = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''

  return `${firstInitial}${lastInitial}`.toUpperCase()
}

function handleLogout() {
  clearAuthToken()
  window.location.assign('/')
}

export function AuthenticatedLayout({
  activeRoute,
  children,
  user,
}: AuthenticatedLayoutProps) {
  return (
    <main className="authenticated-layout">
      <header className="authenticated-navbar">
        <div className="authenticated-navbar__container">
          <a
            aria-label="Ir para o dashboard"
            className="authenticated-navbar__brand"
            href="/dashboard"
          >
            <FinancyLogo className="authenticated-navbar__logo" />
          </a>

          <nav className="authenticated-navbar__nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a
                aria-current={activeRoute === item.key ? 'page' : undefined}
                className={cn(
                  'authenticated-navbar__link',
                  activeRoute === item.key && 'authenticated-navbar__link--active',
                )}
                href={item.href}
                key={item.key}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="authenticated-navbar__actions">
            <div
              className="authenticated-navbar__profile"
              aria-label={user.name}
              title={user.name}
            >
              {getInitials(user.name)}
            </div>
            <IconButton label="Sair" onClick={handleLogout}>
              <LogOut aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </header>

      <div className="authenticated-layout__content">{children}</div>
    </main>
  )
}
