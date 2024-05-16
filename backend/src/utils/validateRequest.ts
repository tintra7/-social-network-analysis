import { MODE } from '@/constants/enum'
import LinkDeviceRequest from '@/models/requests/linkDeviceRequest'
import SendSignalRequest from '@/models/requests/sendSignalRequest'
import SetDeviceRequest from '@/models/requests/setDeviceRequest'
import CreateUserRequest from '@/models/requests/createUserRequest'
import CreateRoomRequest from '@/models/requests/createRoomRequest'
import mongoose from 'mongoose'
import UpdateRoomRequest from '@/models/requests/updateRoomRequest'

export const isLinkRequestValid = (request: LinkDeviceRequest): boolean => {
  if (request.name == undefined) return false
  if (request.brand == undefined) return false
  if (request.userId == undefined) return false

  if (request.profile != undefined) {
    for (const mode of Object.values(MODE)) {
      if (request.profile[mode] != undefined) {
        if (request.profile[mode].fan == undefined) return false
        if (request.profile[mode].temp == undefined) return false
      } else return false
    }
  } else return false

  return true
}

export const isSetDeviceRequestValid = (request: SetDeviceRequest): boolean => {
  console.log(request)
  if (request.deviceId == undefined) return false
  if (request.userId == undefined) return false
  return true
}

export const isSendSignalRequest = (request: SendSignalRequest): boolean => {
  if (request.deviceId == undefined) return false
  if (request.temp == undefined) return false
  if (request.userId == undefined) return false
  if (request.fan == undefined) return false
  if (request.status == undefined) return false
  if (request.profile == undefined) return false
  return true
}

export const isCreateUserRequestValid = (request: CreateUserRequest): boolean => {
  return !!(request.username && request.password)
}

export const isCreateRoomRequestValid = (request: CreateRoomRequest): boolean => {
  if (!(request.width && request.height && request.userId && request.sensorId)) return false
  if (!mongoose.Types.ObjectId.isValid(request.userId)) return false
  if (request.sensorId) {
    for (const sensor of request.sensorId) {
      if (!mongoose.Types.ObjectId.isValid(sensor)) return false
    }
  }
  return true
}

export const isUpdateRoomRequestValid = (request: UpdateRoomRequest): boolean => {
  if (!request.height && !request.width && !request.sensorId) return false
  if (request.sensorId) {
    for (const sensor of request.sensorId) {
      if (!mongoose.Types.ObjectId.isValid(sensor)) return false
    }
  }
  return true
}
