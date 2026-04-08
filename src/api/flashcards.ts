import { sgnlexAxios } from '.'

export const getDueCardsApi = async (limit = 20) => {
  const { data } = await sgnlexAxios.get('/api/v1/flashcards/due', { params: { limit } })
  return data
}

export const submitReviewApi = async (payload: {
  sign: string
  rating: 'easy' | 'good' | 'hard'
  correct: boolean
}) => {
  const { data } = await sgnlexAxios.post('/api/v1/flashcards/review', payload)
  return data
}

export const getNewCardsApi = async (limit = 5) => {
  const { data } = await sgnlexAxios.get('/api/v1/flashcards/new', { params: { limit } })
  return data
}

export const getFlashcardStatsApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/flashcards/stats')
  return data
}
