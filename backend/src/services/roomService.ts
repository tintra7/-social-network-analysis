import { IRoom, Room, Sensor, User } from '@/models/entities'
import CreateRoomRequest from '@/models/requests/createRoomRequest'
import UpdateRoomRequest from '@/models/requests/updateRoomRequest'
import mongoose from 'mongoose'

const createRoom = async (newRoom: CreateRoomRequest) => {
  const { userId } = newRoom
  try {
    const existingUser = await User.findById(userId)
    if (existingUser === null) throw new Error('User not found')
    for (const id of newRoom.sensorId) {
      const existingSensor = await Sensor.findById(id)
      if (existingSensor === null) throw new Error(`Sensor with id ${id} not found`)
    }
    await Room.create(newRoom)
  } catch (error) {
    throw new Error(`Error creating new room: ${error instanceof Error ? error.message : ''}`)
  }
}

const getAllRooms = async (userId: mongoose.Types.ObjectId): Promise<IRoom[]> => {
  try {
    const existingUser = await User.findById(userId)
    if (existingUser === null) throw new Error('User not found')
    const rooms = await Room.find({ userId })
    return rooms
  } catch (error) {
    throw new Error(`Error fetching all rooms: ${error instanceof Error ? error.message : ''}`)
  }
}

const getSingleRoom = async (roomId: mongoose.Types.ObjectId): Promise<IRoom | null> => {
  type Room = IRoom | null
  let room: Room
  try {
    room = await User.findById(roomId)
    if (room) {
      return room
    } else {
      throw new Error(`Room not found`)
    }
  } catch (error) {
    throw new Error(`Error fetching room with id ${roomId}: ${error instanceof Error ? error.message : ''}`)
  }
}

const updateRoomById = async (roomId: mongoose.Types.ObjectId, updatedRoom: UpdateRoomRequest) => {
  try {
    const room = await Room.findById(roomId)
    if (room === null) throw new Error('Room not found')
    for (const id of updatedRoom.sensorId ?? []) {
      const existingSensor = await Sensor.findById(id)
      if (existingSensor === null) throw new Error(`Sensor with id ${id} not found`)
    }
    const result = await Room.findOneAndUpdate(
      { _id: roomId },
      {
        $set: {
          width: updatedRoom.width,
          height: updatedRoom.height,
          sensorId: updatedRoom.sensorId
        }
      },
      {
        returnOriginal: false
      }
    )
  } catch (error) {
    throw new Error(`Error updating room with id ${roomId}: ${error instanceof Error ? error.message : ''}`)
  }
}

const deleteRoomById = async (roomId: mongoose.Types.ObjectId) => {
  try {
    const room = await Room.findById(roomId)
    if (room === null) throw new Error('Room not found')
    await Room.findByIdAndDelete(roomId)
  } catch (error) {
    throw new Error(`Error deleting room with id ${roomId}: ${error instanceof Error ? error.message : ''}`)
  }
}
export default { createRoom, getAllRooms, getSingleRoom, deleteRoomById, updateRoomById }
