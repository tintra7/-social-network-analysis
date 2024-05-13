import mongoose from 'mongoose'

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

export const User = mongoose.model('User', Schema, 'users')
