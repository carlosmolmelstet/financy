import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { LogOut, Mail, UserRound } from 'lucide-react'
import { Button, Input } from '../components/ui'
import { updateProfile, type AuthUser } from '../graphql/auth'
import { clearAuthToken, getAuthToken } from '../lib/auth-session'
import './profile-page.css'

type ProfilePageProps = {
  onUserUpdate: (user: AuthUser) => void
  user: AuthUser
}

type ProfileFormErrors = {
  form?: string
  name?: string
}

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

function getProfileErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Não foi possível salvar as alterações.'
  }

  if (error.message === 'Name must have at least 2 characters') {
    return 'O nome deve ter no mínimo 2 caracteres.'
  }

  if (error.message === 'Name must have at most 120 characters') {
    return 'O nome deve ter no máximo 120 caracteres.'
  }

  return error.message || 'Não foi possível salvar as alterações.'
}

function validateName(name: string): ProfileFormErrors {
  const trimmedName = name.trim()

  if (!trimmedName) {
    return { name: 'Informe seu nome.' }
  }

  if (trimmedName.length < 2) {
    return { name: 'O nome deve ter no mínimo 2 caracteres.' }
  }

  if (trimmedName.length > 120) {
    return { name: 'O nome deve ter no máximo 120 caracteres.' }
  }

  return {}
}

function handleLogout() {
  clearAuthToken()
  window.location.assign('/')
}

export function ProfilePage({ onUserUpdate, user }: ProfilePageProps) {
  const [name, setName] = useState(user.name)
  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const initials = useMemo(() => getInitials(user.name), [user.name])

  useEffect(() => {
    setName(user.name)
    setErrors({})
    setIsSubmitting(false)
  }, [user])

  function updateName(value: string) {
    setName(value)
    setErrors({})
    setSuccessMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateName(name)
    setErrors(nextErrors)
    setSuccessMessage(null)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      window.location.replace('/erro')
      return
    }

    setIsSubmitting(true)

    try {
      const updatedUser = await updateProfile(token, { name: name.trim() })
      onUserUpdate(updatedUser)
      setName(updatedUser.name)
      setSuccessMessage('Alterações salvas.')
    } catch (error) {
      setErrors({ form: getProfileErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="profile-page" aria-labelledby="profile-title">
      <form className="profile-card" noValidate onSubmit={handleSubmit}>
        <header className="profile-card__header">
          <span className="profile-card__avatar" aria-hidden="true">
            {initials}
          </span>

          <div className="profile-card__identity">
            <h1 id="profile-title">{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </header>

        <div className="profile-card__divider" />

        <div className="profile-card__fields">
          <Input
            autoComplete="name"
            disabled={isSubmitting}
            error={errors.name}
            label="Nome completo"
            leftIcon={<UserRound aria-hidden="true" />}
            name="profile-name"
            onChange={(event) => updateName(event.target.value)}
            value={name}
          />

          <Input
            disabled
            helperText="O e-mail não pode ser alterado"
            label="E-mail"
            leftIcon={<Mail aria-hidden="true" />}
            name="profile-email"
            value={user.email}
          />
        </div>

        {errors.form ? (
          <p className="profile-card__message profile-card__message--error" role="alert">
            {errors.form}
          </p>
        ) : null}

        {successMessage ? (
          <p className="profile-card__message profile-card__message--success" role="status">
            {successMessage}
          </p>
        ) : null}

        <div className="profile-card__actions">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>

          <Button
            icon={<LogOut aria-hidden="true" />}
            onClick={handleLogout}
            type="button"
            variant="outline"
          >
            Sair da conta
          </Button>
        </div>
      </form>
    </section>
  )
}
