const defaultBackendUrl = 'http://localhost:4000/graphql'

export const env = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || defaultBackendUrl,
} as const
