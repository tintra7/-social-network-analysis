import mongoose from 'mongoose'

const Schema = new mongoose.Schema(
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

export const Esp = mongoose.model('Esp', Schema, 'esps')
