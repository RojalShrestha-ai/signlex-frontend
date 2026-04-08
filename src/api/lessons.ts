import { sgnlexAxios } from '.'

export const getAllLessonsApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/lessons')
  return data
}

export const getAllLessonProgressApi = async () => {
  const { data } = await sgnlexAxios.get('/api/v1/lessons/progress')
  return data
}

export const getLessonProgressApi = async (lessonId: string) => {
  const { data } = await sgnlexAxios.get(`/api/v1/lessons/${lessonId}/progress`)
  return data
}

export const updateLessonProgressApi = async (payload: {
  lessonId: string
  progress: number
  total: number
  correctAnswers: number
}) => {
  const { lessonId, ...body } = payload
  const { data } = await sgnlexAxios.put(`/api/v1/lessons/${lessonId}/progress`, body)
  return data
}

export const completeLessonApi = async (payload: {
  lessonId: string
  correctAnswers: number
  total: number
}) => {
  const { lessonId, ...body } = payload
  const { data } = await sgnlexAxios.post(`/api/v1/lessons/${lessonId}/complete`, body)
  return data
}
