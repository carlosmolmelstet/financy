import { useEffect, useState } from 'react'
import { AuthenticatedLayout, type AuthenticatedRouteKey } from '../components/layout'
import { getAuthenticatedUser, type AuthUser } from '../graphql/auth'
import { clearAuthToken, getAuthToken } from '../lib/auth-session'
import { DashboardPage } from './DashboardPage'
import './authenticated-page.css'

type AuthenticatedPageProps = {
  route: AuthenticatedRouteKey
}

const routeContent: Record<AuthenticatedRouteKey, { title: string; description: string }> = {
  categories: {
    description: 'Organize os grupos usados para classificar suas movimentações.',
    title: 'Categorias',
  },
  dashboard: {
    description: 'Acompanhe o resumo financeiro da sua conta.',
    title: 'Dashboard',
  },
  transactions: {
    description: 'Consulte e gerencie suas entradas e saídas.',
    title: 'Transações',
  },
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

  const content = routeContent[route]

  return (
    <AuthenticatedLayout activeRoute={route} user={user}>
      {route === 'dashboard' ? (
        <DashboardPage />
      ) : (
        <section className="authenticated-page__section" aria-labelledby="authenticated-page-title">
          <header className="authenticated-page__header">
            <h1 id="authenticated-page-title">{content.title}</h1>
            <p>{content.description}</p>
          </header>
        </section>
      )}
    </AuthenticatedLayout>
  )
}
