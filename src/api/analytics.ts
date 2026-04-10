import { sgnlexAxios } from '.'

export const getRecentActivityApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/analytics/activity')
  return data
}

export const getWeeklySummaryApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/analytics/weekly-summary')
  return data
}
