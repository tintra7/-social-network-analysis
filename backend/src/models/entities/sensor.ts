import mongoose from 'mongoose'

const Schema = new mongoose.Schema(
  {
    temp: {
      type: Number
    },
    humidity: {
      type: Number
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
