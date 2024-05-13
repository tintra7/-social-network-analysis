import mongoose from 'mongoose'

const Schema = new mongoose.Schema(
  {
    temp: {
      type: Number
    },
    humidity: {
      type: Number
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    espId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Esp'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Sensor = mongoose.model('Sensor', Schema, 'sensor')
