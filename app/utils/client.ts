import { HttpMethod } from 'http-enums'

import { publishError } from './handle.error'

const headers = {
  Accept: 'application/json'
}
const jsonHeaders = {
  ...headers,
  'Content-Type': 'application/json'
}
const statusReject = (response: Response) => (response.ok ? response : Promise.reject(response))
export const extractJson = (response: Response) => response.json()

const client = {
  get: (url: string) => fetch(url, { headers }).then(statusReject).then(extractJson).catch(publishError),
  post: (url: string, body: any) =>
    fetch(url, { body: JSON.stringify(body), method: HttpMethod.POST, headers: jsonHeaders })
      .then(statusReject)
      .then(extractJson)
      .catch(publishError),
  patch: (url: string, body: any) =>
    fetch(url, { body: JSON.stringify(body), method: HttpMethod.PATCH, headers: jsonHeaders })
      .then(statusReject)
      .then(extractJson)
      .catch(publishError)
}

export { client }
