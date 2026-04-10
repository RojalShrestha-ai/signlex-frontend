import { sgnlexAxios } from '.'

export const getGlobalRankingsApi = async (limit = 20) => {
  const { data } = await sgnlexAxios.get('/api/v1/leaderboard/global', { params: { limit } })
  return data
}

export const getWeeklyRankingsApi = async (limit = 20) => {
  const { data } = await sgnlexAxios.get('/api/v1/leaderboard/weekly', { params: { limit } })
  return data
}

export const getMonthlyRankingsApi = async (limit = 20) => {
  const { data } = await sgnlexAxios.get('/api/v1/leaderboard/monthly', { params: { limit } })
  return data
}

export const getMyRankApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/leaderboard/me')
  return data
}
