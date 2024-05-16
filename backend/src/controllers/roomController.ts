import CreateRoomRequest from '@/models/requests/createRoomRequest'
import UpdateRoomRequest from '@/models/requests/updateRoomRequest'
import roomService from '@/services/roomService'
import { isCreateRoomRequestValid, isUpdateRoomRequestValid } from '@/utils/validateRequest'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

const getAllRooms = async (req: Request, res: Response) => {
  const userId = req.query.userId as string
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' })
  }
  try {
    const rooms = await roomService.getAllRooms(new mongoose.Types.ObjectId(userId))
    res.status(200).json(rooms)
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}

const getSingleRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId' })
  }
  try {
    const room = await roomService.getSingleRoom(new mongoose.Types.ObjectId(roomId))
    res.status(200).json(room)
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}

const createRoom = async (req: Request, res: Response) => {
  const newRoom = <CreateRoomRequest>req.body
  try {
    if (!isCreateRoomRequestValid(newRoom)) return res.status(400).send({ message: 'Invalid field(s)' })
    await roomService.createRoom(newRoom)
    res.json({ message: 'Successfully created new room' })
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}

const updateRoomById = async (req: Request, res: Response) => {
  const { roomId } = req.params
  const updatedRoom = <UpdateRoomRequest>req.body
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId' })
  }
  try {
    if (!isUpdateRoomRequestValid(updatedRoom)) return res.status(400).send({ message: 'Invalid field(s)' })
    await roomService.updateRoomById(new mongoose.Types.ObjectId(roomId), updatedRoom)
    res.status(200).json({ message: 'Successfully updated room' })
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}

const deleteRoomById = async (req: Request, res: Response) => {
  const { roomId } = req.params
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId' })
  }
  try {
    await roomService.deleteRoomById(new mongoose.Types.ObjectId(roomId))
    res.status(200).json({ message: 'Successfully deleted room' })
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}

export default { getAllRooms, getSingleRoom, createRoom, updateRoomById, deleteRoomById }
