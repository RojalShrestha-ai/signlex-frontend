import axios from 'axios'

const apiHost = process.env.NEXT_PUBLIC_API_HOST

export const sgnlexAxios = axios.create({
  baseURL: apiHost,
  withCredentials: true,
})

sgnlexAxios.interceptors.request.use((request: any) => {
  if (request.url && !request.url.endsWith('/') && !request.url.includes('?')) {
    request.url = request.url + '/'
  }
  return request
})

sgnlexAxios.interceptors.request.use((request: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('signlex.auth.token')
    if (token) {
      request.headers = request.headers ?? {}
      request.headers.Authorization = `Bearer ${token}`
    }
  }
  return request
})
