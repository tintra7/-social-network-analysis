import CreateUserRequest from '@/models/requests/createUserRequest'
import userService from '@/services/userService'
import { isCreateUserRequestValid } from '@/utils/validateRequest'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = <CreateUserRequest>req.body
    if (!isCreateUserRequestValid(newUser)) throw Error('Missing field(s)')
    await userService.createUser(newUser)
    res.status(200).json({ message: 'Successfully created new user' })
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}

const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' })
  }
  try {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(userId))
    res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) res.status(500).send({ message: error.message })
  }
}
export default { createUser, getUserById }
