import { getAuthToken } from './lib/auth-session'
import { AuthErrorPage } from './pages/AuthErrorPage'
import { LoginPage } from './pages/LoginPage'
import { SessionTestPage } from './pages/SessionTestPage'
import { SignupPage } from './pages/SignupPage'

function App() {
  const pathname = window.location.pathname

  if (pathname === '/cadastro') {
    return <SignupPage />
  }

  if (pathname === '/app' || pathname === '/dashboard') {
    return <SessionTestPage />
  }

  if (pathname === '/erro') {
    return <AuthErrorPage />
  }

  if (pathname === '/' && getAuthToken()) {
    return <SessionTestPage />
  }

  return <LoginPage />
}

export default App
