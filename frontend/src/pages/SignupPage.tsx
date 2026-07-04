import { useState, type FormEvent } from 'react'
import { Eye, EyeClosed, Lock, LogIn, Mail, UserRound } from 'lucide-react'
import { FinancyLogo } from '../components/brand/FinancyLogo'
import { Button, ButtonLink, Input } from '../components/ui'
import { createAccount } from '../graphql/auth'
import { saveAuthToken } from '../lib/auth-session'
import {
  getAuthErrorMessage,
  hasFormErrors,
  type FormErrors,
  type SignupFormValues,
  validateSignupForm,
} from '../lib/auth-validation'
import './signup-page.css'

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [values, setValues] = useState<SignupFormValues>({
    email: '',
    name: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors<SignupFormValues>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<TField extends keyof SignupFormValues>(
    field: TField,
    value: SignupFormValues[TField],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
    setFormError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateSignupForm(values)
    setErrors(nextErrors)

    if (hasFormErrors(nextErrors)) {
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const payload = await createAccount({
        email: values.email.trim().toLowerCase(),
        name: values.name.trim(),
        password: values.password,
      })

      saveAuthToken(payload.token, true)
      window.location.assign('/app')
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="signup-page" aria-labelledby="signup-title">
      <FinancyLogo className="signup-page__logo" />

      <section className="signup-page__card">
        <header className="signup-page__header">
          <h1 id="signup-title">Criar conta</h1>
          <p>Comece a controlar suas finanças ainda hoje</p>
        </header>

        <form
          className="signup-page__form"
          aria-describedby={formError ? 'signup-form-error' : undefined}
          aria-label="Formulario de cadastro"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="signup-page__inputs">
            <Input
              autoComplete="name"
              disabled={isSubmitting}
              error={errors.name}
              label="Nome completo"
              leftIcon={<UserRound aria-hidden="true" />}
              name="name"
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Seu nome completo"
              type="text"
              value={values.name}
            />

            <Input
              autoComplete="email"
              disabled={isSubmitting}
              error={errors.email}
              label="E-mail"
              leftIcon={<Mail aria-hidden="true" />}
              name="email"
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="mail@exemplo.com"
              type="email"
              value={values.email}
            />

            <Input
              autoComplete="new-password"
              disabled={isSubmitting}
              error={errors.password}
              helperText="A senha deve ter no mínimo 6 caracteres"
              label="Senha"
              leftIcon={<Lock aria-hidden="true" />}
              name="password"
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Digite sua senha"
              rightIcon={
                showPassword ? (
                  <Eye aria-hidden="true" />
                ) : (
                  <EyeClosed aria-hidden="true" />
                )
              }
              rightIconButtonProps={{
                'aria-label': showPassword ? 'Ocultar senha' : 'Mostrar senha',
                'aria-pressed': showPassword,
                disabled: isSubmitting,
                onClick: () => setShowPassword((current) => !current),
                title: showPassword ? 'Ocultar senha' : 'Mostrar senha',
              }}
              type={showPassword ? 'text' : 'password'}
              value={values.password}
            />
          </div>

          {formError ? (
            <p className="signup-page__alert" id="signup-form-error" role="alert">
              {formError}
            </p>
          ) : null}

          <Button className="signup-page__action" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

          <div className="signup-page__divider" aria-hidden="true">
            <span />
            <strong>ou</strong>
            <span />
          </div>

          <div className="signup-page__signin">
            <p>Já tem uma conta?</p>
            <ButtonLink
              className="signup-page__action"
              href="/login"
              icon={<LogIn aria-hidden="true" />}
              variant="outline"
            >
              Fazer login
            </ButtonLink>
          </div>
        </form>
      </section>
    </main>
  )
}
