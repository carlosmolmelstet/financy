import { useState, type FormEvent } from 'react'
import { Eye, EyeClosed, Lock, Mail, UserRoundPlus } from 'lucide-react'
import { FinancyLogo } from '../components/brand/FinancyLogo'
import { Button, ButtonLink, Input, TextLink } from '../components/ui'
import { login } from '../graphql/auth'
import { saveAuthToken } from '../lib/auth-session'
import {
  getAuthErrorMessage,
  hasFormErrors,
  type FormErrors,
  type LoginFormValues,
  validateLoginForm,
} from '../lib/auth-validation'
import './login-page.css'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [values, setValues] = useState<LoginFormValues>({
    email: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<TField extends keyof LoginFormValues>(
    field: TField,
    value: LoginFormValues[TField],
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

    const nextErrors = validateLoginForm(values)
    setErrors(nextErrors)

    if (hasFormErrors(nextErrors)) {
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const payload = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })

      saveAuthToken(payload.token, values.remember)
      window.location.assign('/app')
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page" aria-labelledby="login-title">
      <FinancyLogo className="login-page__logo" />

      <section className="login-page__card">
        <header className="login-page__header">
          <h1 id="login-title">Fazer login</h1>
          <p>Entre na sua conta para continuar</p>
        </header>

        <form
          className="login-page__form"
          aria-describedby={formError ? 'login-form-error' : undefined}
          aria-label="Formulario de login"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="login-page__inputs">
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
              autoComplete="current-password"
              disabled={isSubmitting}
              error={errors.password}
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

            <div className="login-page__links">
              <label className="login-page__remember">
                <input
                  checked={values.remember}
                  disabled={isSubmitting}
                  name="remember"
                  onChange={(event) => updateField('remember', event.target.checked)}
                  type="checkbox"
                />
                <span>Lembrar-me</span>
              </label>

              <TextLink href="#recuperar-senha">Recuperar senha</TextLink>
            </div>
          </div>

          {formError ? (
            <p className="login-page__alert" id="login-form-error" role="alert">
              {formError}
            </p>
          ) : null}

          <Button className="login-page__action" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="login-page__divider" aria-hidden="true">
            <span />
            <strong>ou</strong>
            <span />
          </div>

          <div className="login-page__signup">
            <p>Ainda não tem uma conta?</p>
            <ButtonLink
              className="login-page__action"
              href="/cadastro"
              icon={<UserRoundPlus aria-hidden="true" />}
              variant="outline"
            >
              Criar conta
            </ButtonLink>
          </div>
        </form>
      </section>
    </main>
  )
}
