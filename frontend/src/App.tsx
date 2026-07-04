import { getAuthToken } from './lib/auth-session'
import { AuthenticatedPage } from './pages/AuthenticatedPage'
import { AuthErrorPage } from './pages/AuthErrorPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

function App() {
  const pathname = window.location.pathname

  if (pathname === '/cadastro') {
    return <SignupPage />
  }

  if (pathname === '/app' || pathname === '/dashboard') {
    return <AuthenticatedPage route="dashboard" />
  }

  if (pathname === '/transacoes') {
    return <AuthenticatedPage route="transactions" />
  }

  if (pathname === '/categorias') {
    return <AuthenticatedPage route="categories" />
  }

  if (pathname === '/erro') {
    return <AuthErrorPage />
  }

  if (pathname === '/' && getAuthToken()) {
    return <AuthenticatedPage route="dashboard" />
  }

  return <LoginPage />
}

export default App
