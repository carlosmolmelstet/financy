const authTokenKey = 'financy.auth.token'

export function getAuthToken(): string | null {
  return localStorage.getItem(authTokenKey) ?? sessionStorage.getItem(authTokenKey)
}

export function saveAuthToken(token: string, remember: boolean): void {
  clearAuthToken()

  if (remember) {
    localStorage.setItem(authTokenKey, token)
    return
  }

  sessionStorage.setItem(authTokenKey, token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(authTokenKey)
  sessionStorage.removeItem(authTokenKey)
}
