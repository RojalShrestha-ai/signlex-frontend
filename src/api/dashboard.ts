import { sgnlexAxios } from '.'

export const getDashboardStatsApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/users/dashboard')
  return data
}

export const getUserProfileApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/users/me')
  return data
}

export const updateUserProfileApi = async (updates: { displayName?: string; photoURL?: string }) => {
  const { data } = await sgnlexAxios.put('/api/v1/users/me', updates)
  return data
}
