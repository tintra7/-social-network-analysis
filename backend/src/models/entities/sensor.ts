import mongoose from 'mongoose'

interface ISensor extends mongoose.Document {
  temp: number
  humidity: number
  espId: mongoose.Types.ObjectId
}

const Schema = new mongoose.Schema<ISensor>(
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

export const Sensor = mongoose.model<ISensor>('Sensor', Schema, 'sensors')
