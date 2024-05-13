import mongoose from 'mongoose'

const Schema = new mongoose.Schema(
  {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    versionKey: false
  }
)

export const Room = mongoose.model('Room', Schema, 'rooms')
