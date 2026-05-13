const TOKEN_KEY = 'gym_admin_token'
const ADMIN_KEY = 'gym_admin_profile'

export const saveAuthSession = ({ token, admin }) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY)

export const getAdminProfile = () => {
  const raw = localStorage.getItem(ADMIN_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
}

export const isAuthenticated = () => Boolean(getAuthToken())
