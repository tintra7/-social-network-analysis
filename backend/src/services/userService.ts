import CreateUserRequest from '@/models/requests/createUserRequest'
import { IUser, User } from '@/models/entities'
import mongoose, { mongo } from 'mongoose'

const createUser = async (user: CreateUserRequest) => {
  try {
    const existingUser = await User.findOne({ username: user.username })
    if (existingUser) {
      throw new Error(`User with the username ${user.username} already exists`)
    }
    await User.create(user)
  } catch (error) {
    throw new Error(`Error when creating new user: ${error instanceof Error ? error.message : ''}`)
  }
}

const getUserById = async (userId: mongoose.Types.ObjectId): Promise<IUser | null> => {
  type User = IUser | null
  let user: User
  try {
    user = await User.findById(userId)
    if (user) {
      return user
    } else {
      throw new Error(`User not found`)
    }
  } catch (error) {
    throw new Error(`Error when fetching user with the id ${userId}: ${error instanceof Error ? error.message : ''}`)
  }
}

export default { createUser, getUserById }
