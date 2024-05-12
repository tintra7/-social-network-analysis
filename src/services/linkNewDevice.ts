import axios from 'axios'

import { apiUrl } from '@/constants/serverConfig'
import { LinkDeviceRequest } from '@/models/requests/linkDeviceRequest'

const linkNewDevice = async (requestBody: LinkDeviceRequest) => {
  try {
    await axios.post(`${apiUrl}`, requestBody)
  } catch (error) {
    console.error(error)
  }
}

export default linkNewDevice
