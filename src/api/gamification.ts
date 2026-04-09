import { sgnlexAxios } from '.'

export const awardXPApi = async (payload: { amount: number; reason?: string }) => {
  const { data } = await sgnlexAxios.post('/api/v1/gamification/xp', payload)
  return data
}

export const getStreakApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/gamification/streak')
  return data
}

export const dailyCheckinApi = async () => {
  const { data } = await sgnlexAxios.post('/api/v1/gamification/streak/checkin')
  return data
}

export const getAchievementsApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/gamification/achievements')
  return data
}

export const getAvailableBadgesApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/gamification/achievements/available')
  return data
}

export const getLevelInfoApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/gamification/level')
  return data
}
