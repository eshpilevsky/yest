import axios from 'axios'

const inst = axios.create({
  baseURL: 'http://178.172.172.89:3210'
})

inst.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default inst
