import { useEffect, useState } from 'react'
import {
  Lock,
  Mail,
  PiggyBank,
  Plus,
  Search,
  SquarePen,
  Trash,
  Wallet,
} from 'lucide-react'
import './App.css'
import {
  Button,
  IconButton,
  Input,
  Tag,
  TransactionTypeBadge,
} from './components/ui'
import { getHealth } from './graphql/health'

type ApiStatus = 'checking' | 'online' | 'offline'

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')

  useEffect(() => {
    let ignore = false

    async function loadHealth() {
      try {
        await getHealth()

        if (!ignore) {
          setApiStatus('online')
        }
      } catch {
        if (!ignore) {
          setApiStatus('offline')
        }
      }
    }

    loadHealth()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="preview-shell">
      <section className="preview-board" aria-labelledby="preview-title">
        <header className="preview-header">
          <div className="preview-brand" aria-label="Financy">
            <span className="preview-brand__mark">
              <PiggyBank aria-hidden="true" size={20} strokeWidth={2.25} />
            </span>
            <span>Financy</span>
          </div>
          <Tag tone={apiStatus === 'online' ? 'green' : 'gray'}>
            {apiStatus === 'online'
              ? 'API conectada'
              : apiStatus === 'checking'
                ? 'Conectando'
                : 'API indisponivel'}
          </Tag>
        </header>

        <div className="preview-grid">
          <section className="preview-main" aria-labelledby="preview-title">
            <div className="preview-section-header">
              <div>
                <p className="preview-eyebrow">Visao geral</p>
                <h1 id="preview-title">Resumo financeiro</h1>
              </div>
              <Button icon={<Plus aria-hidden="true" />}>Nova transacao</Button>
            </div>

            <div className="summary-grid" aria-label="Resumo">
              <article className="summary-card">
                <Wallet aria-hidden="true" size={20} />
                <span>Saldo</span>
                <strong>R$ 4.820,00</strong>
              </article>
              <article className="summary-card">
                <TransactionTypeBadge type="INCOME" />
                <span>Entradas</span>
                <strong>R$ 7.200,00</strong>
              </article>
              <article className="summary-card">
                <TransactionTypeBadge type="EXPENSE" />
                <span>Saidas</span>
                <strong>R$ 2.380,00</strong>
              </article>
            </div>

            <section className="preview-list" aria-label="Transacoes recentes">
              <div className="preview-list__header">
                <h2>Transacoes recentes</h2>
                <Input
                  aria-label="Buscar transacao"
                  label="Buscar"
                  leftIcon={<Search aria-hidden="true" />}
                  placeholder="Buscar"
                />
              </div>

              <article className="transaction-row">
                <div>
                  <strong>Mercado</strong>
                  <span>Alimentacao</span>
                </div>
                <Tag tone="green">Alimentacao</Tag>
                <TransactionTypeBadge type="EXPENSE" />
                <strong className="transaction-row__amount">R$ 240,00</strong>
                <div className="transaction-row__actions">
                  <IconButton label="Editar transacao">
                    <SquarePen aria-hidden="true" />
                  </IconButton>
                  <IconButton label="Excluir transacao" variant="danger">
                    <Trash aria-hidden="true" />
                  </IconButton>
                </div>
              </article>
            </section>
          </section>

          <aside className="preview-side" aria-label="Formulario">
            <h2>Acesso</h2>
            <Input
              label="E-mail"
              leftIcon={<Mail aria-hidden="true" />}
              placeholder="voce@email.com"
              type="email"
            />
            <Input
              helperText="Minimo de 6 caracteres"
              label="Senha"
              leftIcon={<Lock aria-hidden="true" />}
              placeholder="Sua senha"
              type="password"
            />
            <Button size="sm">Entrar</Button>
            <Button size="sm" variant="outline">
              Criar conta
            </Button>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
