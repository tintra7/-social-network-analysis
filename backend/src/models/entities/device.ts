import mongoose from 'mongoose'

import { BRAND, MODE, STATUS, FANSPEED } from '@/constants/enum'

interface IProfile {
  temp: number
  fan: FANSPEED
}

export interface IDevice extends mongoose.Document {
  roomId: mongoose.Types.ObjectId
  espId: mongoose.Types.ObjectId
  name: string
  status: STATUS
  fan: FANSPEED
  temp: number
  brand: BRAND
  currentProfile: MODE
  profile: {
    [key in MODE]: IProfile
  }
}

const Schema = new mongoose.Schema<IDevice>(
  {
    brand: String,
    status: {
      type: String,
      default: STATUS.OFF
    },
    profile: {
      MOISTURING: {
        temp: Number,
        fan: String
      },
      COOLING: {
        temp: Number,
        fan: String
      },
      DEFAULT: {
        temp: Number,
        fan: String
      }
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    espId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Esp'
    },
    fan: {
      type: String,
      default: FANSPEED.NONE
    },
    temp: {
      type: Number,
      default: -1
    },
    currentProfile: {
      type: String,
      default: MODE.DEFAULT
    },
    name: {
      type: String,
      required: function () {
        return this.name.trim()
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Device = mongoose.model<IDevice>('Device', Schema, 'devices')
