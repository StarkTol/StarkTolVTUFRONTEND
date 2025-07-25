import axiosMock from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { httpClient } from '../api/httpClient'

describe('HTTP Client', () => {
  let mock: AxiosMockAdapter

  beforeAll(() => {
    mock = new AxiosMockAdapter(axiosMock)
  })

  afterEach(() => {
    mock.reset()
  })

  afterAll(() => {
    mock.restore()
  })

  describe('Retry Logic', () => {
    it('should retry on network error', async () => {
      mock.onGet('/retry-test').networkError()

      const result = await httpClient.get('/retry-test')

      expect(result.success).toBe(false)
      expect(result.error?.isNetworkError).toBe(true)
      expect(result.error?.isRetriable).toBe(true)
    })

    it('should not retry on client error', async () => {
      mock.onGet('/client-error').reply(400)

      const result = await httpClient.get('/client-error')

      expect(result.success).toBe(false)
      expect(result.error?.status).toBe(400)
      expect(result.error?.isRetriable).toBe(false)
    })
  })

  describe('Refresh Token Logic', () => {
    it('should attempt to refresh token on 401 error', async () => {
      const refreshToken = 'refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh', { refresh_token: refreshToken }).reply(200, {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      })
      mock.onGet('/protected').reply(200, {})

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(true)
      expect(localStorage.getItem('access_token')).toBe('new-access-token')
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token')
    })

    it('should handle refresh token failure', async () => {
      const refreshToken = 'invalid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh', { refresh_token: refreshToken }).reply(401)

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(401)
    })
  })
})

