import { useEffect, useState } from 'react'
import './App.css'
import { getHealth, type HealthCheck } from './graphql/health'
import { env } from './lib/env'

type ApiStatus =
  | { status: 'loading' }
  | { status: 'available'; health: HealthCheck }
  | { status: 'unavailable'; message: string }

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ status: 'loading' })

  useEffect(() => {
    let ignore = false

    async function loadHealth() {
      try {
        const health = await getHealth()

        if (!ignore) {
          setApiStatus({ status: 'available', health })
        }
      } catch (error) {
        if (!ignore) {
          setApiStatus({
            status: 'unavailable',
            message:
              error instanceof Error
                ? error.message
                : 'Nao foi possivel conectar com a API.',
          })
        }
      }
    }

    loadHealth()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="setup-panel" aria-labelledby="app-title">
        <span className="setup-kicker">Financy</span>
        <h1 id="app-title">Frontend configurado</h1>
        <p>
          Base React, Vite, TypeScript e client GraphQL preparada para as
          proximas fases.
        </p>

        <dl className="status-list">
          <div>
            <dt>API GraphQL</dt>
            <dd>{env.backendUrl}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              {apiStatus.status === 'loading' && 'Verificando conexao...'}
              {apiStatus.status === 'available' &&
                `${apiStatus.health.service} online`}
              {apiStatus.status === 'unavailable' && apiStatus.message}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  )
}

export default App
