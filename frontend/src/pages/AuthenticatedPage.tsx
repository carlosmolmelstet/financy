import { useEffect, useState } from 'react'
import { AuthenticatedLayout, type AuthenticatedRouteKey } from '../components/layout'
import { getAuthenticatedUser, type AuthUser } from '../graphql/auth'
import { clearAuthToken, getAuthToken } from '../lib/auth-session'
import { CategoriesPage } from './CategoriesPage'
import { DashboardPage } from './DashboardPage'
import { ProfilePage } from './ProfilePage'
import { TransactionsPage } from './TransactionsPage'
import './authenticated-page.css'

type AuthenticatedPageProps = {
  route: AuthenticatedRouteKey
}

export function AuthenticatedPage({ route }: AuthenticatedPageProps) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      window.location.replace('/erro')
      return
    }

    let isActive = true

    getAuthenticatedUser(token)
      .then((currentUser) => {
        if (isActive) {
          setUser(currentUser)
        }
      })
      .catch(() => {
        clearAuthToken()

        if (isActive) {
          window.location.replace('/erro')
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  if (!user) {
    return (
      <main className="authenticated-page authenticated-page--loading">
        <div className="authenticated-page__loading" role="status">
          Validando sessão...
        </div>
      </main>
    )
  }

  return (
    <AuthenticatedLayout activeRoute={route} user={user}>
      {route === 'dashboard' ? (
        <DashboardPage />
      ) : route === 'categories' ? (
        <CategoriesPage />
      ) : route === 'profile' ? (
        <ProfilePage onUserUpdate={setUser} user={user} />
      ) : (
        <TransactionsPage />
      )}
    </AuthenticatedLayout>
  )
}
