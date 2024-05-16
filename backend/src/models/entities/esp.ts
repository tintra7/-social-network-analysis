import mongoose from 'mongoose'

interface IEsp extends mongoose.Document {
  userId: mongoose.Types.ObjectId
}

const Schema = new mongoose.Schema<IEsp>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Esp = mongoose.model<IEsp>('Esp', Schema, 'esps')
