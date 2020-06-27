import axios from 'axios'

const inst = axios.create({
  baseURL: 'https://yestapi.xyz'
})

inst.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default inst
