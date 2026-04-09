import { sgnlexAxios } from '.'

export const recordAttemptApi = async (payload: { sign: string; correct: boolean; accuracy: number }) => {
  const { data } = await sgnlexAxios.post('/api/v1/progress/record', payload)
  return data
}

export const getProgressOverviewApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/progress/overview')
  return data
}

export const recordSessionApi = async (payload: {
  sessionType: string
  duration: number
  signsAttempted: Array<{ sign: string; correct: boolean }>
}) => {
  const { data } = await sgnlexAxios.post('/api/v1/progress/session', payload)
  return data
}

export const getSessionHistoryApi = async (page = 1, limit = 10) => {
  const { data } = await sgnlexAxios.get('/api/v1/progress/sessions', { params: { page, limit } })
  return data
}
