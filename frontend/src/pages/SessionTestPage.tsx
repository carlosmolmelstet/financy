import { useEffect, useState } from 'react'
import { CalendarDays, Fingerprint, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { FinancyLogo } from '../components/brand/FinancyLogo'
import { Button } from '../components/ui'
import { getAuthenticatedUser, type AuthUser } from '../graphql/auth'
import { clearAuthToken, getAuthToken } from '../lib/auth-session'
import './session-test-page.css'

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function SessionTestPage() {
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

  function handleLogout() {
    clearAuthToken()
    window.location.assign('/login')
  }

  return (
    <main className="session-page" aria-labelledby="session-title">
      <header className="session-page__topbar">
        <FinancyLogo className="session-page__logo" />
        <Button
          icon={<LogOut aria-hidden="true" />}
          onClick={handleLogout}
          size="sm"
          variant="outline"
        >
          Sair
        </Button>
      </header>

      <section className="session-page__content">
        <div className="session-page__status">
          <ShieldCheck aria-hidden="true" />
          <span>Sessão autenticada</span>
        </div>

        <header className="session-page__header">
          <h1 id="session-title">Conta conectada</h1>
          <p>Dados da pessoa usuária logada nesta sessão.</p>
        </header>

        {user ? (
          <dl className="session-page__details">
            <div>
              <dt>
                <UserRound aria-hidden="true" />
                Nome
              </dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>
                <Mail aria-hidden="true" />
                E-mail
              </dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>
                <Fingerprint aria-hidden="true" />
                ID
              </dt>
              <dd>{user.id}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays aria-hidden="true" />
                Criada em
              </dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        ) : (
          <div className="session-page__loading" role="status">
            Validando sessão...
          </div>
        )}
      </section>
    </main>
  )
}
