export type LoginFormValues = {
  email: string
  password: string
  remember: boolean
}

export type SignupFormValues = {
  name: string
  email: string
  password: string
}

export type FormErrors<TValues> = Partial<Record<keyof TValues, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm(
  values: LoginFormValues,
): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {}
  const email = values.email.trim().toLowerCase()

  if (!email) {
    errors.email = 'Informe seu e-mail.'
  } else if (!emailPattern.test(email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!values.password) {
    errors.password = 'Informe sua senha.'
  } else if (values.password.length < 6) {
    errors.password = 'A senha deve ter no mínimo 6 caracteres.'
  } else if (values.password.length > 72) {
    errors.password = 'A senha deve ter no máximo 72 caracteres.'
  }

  return errors
}

export function validateSignupForm(
  values: SignupFormValues,
): FormErrors<SignupFormValues> {
  const errors: FormErrors<SignupFormValues> = {}
  const name = values.name.trim()
  const email = values.email.trim().toLowerCase()

  if (!name) {
    errors.name = 'Informe seu nome.'
  } else if (name.length < 2) {
    errors.name = 'O nome deve ter no mínimo 2 caracteres.'
  } else if (name.length > 120) {
    errors.name = 'O nome deve ter no máximo 120 caracteres.'
  }

  if (!email) {
    errors.email = 'Informe seu e-mail.'
  } else if (!emailPattern.test(email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!values.password) {
    errors.password = 'Crie uma senha.'
  } else if (values.password.length < 6) {
    errors.password = 'A senha deve ter no mínimo 6 caracteres.'
  } else if (values.password.length > 72) {
    errors.password = 'A senha deve ter no máximo 72 caracteres.'
  }

  return errors
}

export function hasFormErrors<TValues>(errors: FormErrors<TValues>): boolean {
  return Object.values(errors).some(Boolean)
}

export function getAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : ''

  if (message === 'Network request failed') {
    return 'Não foi possível conectar ao backend. Verifique se a API está rodando.'
  }

  if (message === 'Invalid email or password') {
    return 'E-mail ou senha inválidos.'
  }

  if (message === 'Email is already in use') {
    return 'Este e-mail já está em uso.'
  }

  if (message === 'Invalid email') {
    return 'Informe um e-mail válido.'
  }

  if (message === 'Authentication required') {
    return 'Sua sessão expirou. Faça login novamente.'
  }

  if (message.startsWith('Password must have at least')) {
    return 'A senha deve ter no mínimo 6 caracteres.'
  }

  if (message.startsWith('Password must have at most')) {
    return 'A senha deve ter no máximo 72 caracteres.'
  }

  if (message.startsWith('Name must have at least')) {
    return 'O nome deve ter no mínimo 2 caracteres.'
  }

  if (message.startsWith('Name must have at most')) {
    return 'O nome deve ter no máximo 120 caracteres.'
  }

  return 'Não foi possível concluir a solicitação. Tente novamente.'
}
