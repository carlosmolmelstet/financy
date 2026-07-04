import { LogIn } from 'lucide-react'
import { FinancyLogo } from '../components/brand/FinancyLogo'
import { ButtonLink } from '../components/ui'
import './auth-error-page.css'

export function AuthErrorPage() {
  return (
    <main className="auth-error-page" aria-labelledby="auth-error-title">
      <FinancyLogo className="auth-error-page__logo" />

      <section className="auth-error-page__card">
        <header className="auth-error-page__header">
          <h1 id="auth-error-title">Acesso não autorizado</h1>
          <p>Sua sessão não está ativa. Faça login novamente para continuar.</p>
        </header>

        <ButtonLink
          className="auth-error-page__action"
          href="/login"
          icon={<LogIn aria-hidden="true" />}
        >
          Ir para login
        </ButtonLink>
      </section>
    </main>
  )
}
