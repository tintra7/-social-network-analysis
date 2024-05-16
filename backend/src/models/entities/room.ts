import mongoose from 'mongoose'

export interface IRoom extends mongoose.Document {
  width: number
  height: number
  userId: mongoose.Types.ObjectId
  sensorId: mongoose.Types.ObjectId[]
}

const Schema = new mongoose.Schema(
  {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sensorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: true
      }
    ]
  },
  {
    versionKey: false
  }
)

export const Room = mongoose.model<IRoom>('Room', Schema, 'rooms')
