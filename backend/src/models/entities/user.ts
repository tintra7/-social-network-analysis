import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  username: string
  password: string
}

const Schema = new mongoose.Schema(
  {
    username: {
      type: String
    },
    password: {
      type: String
    }
  },
  {
    versionKey: false
  }
)

export const User = mongoose.model<IUser>('User', Schema, 'users')
