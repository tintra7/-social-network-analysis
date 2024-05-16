import dotenv from 'dotenv'
import express, { Application } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import deviceRouter from '@/routes/deviceRoute'
import userRouter from '@/routes/userRoute'
import roomRouter from '@/routes/roomRoute'

dotenv.config()
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME
const DB_URI = process.env.DB_URI || ''
const PORT = process.env.PORT

const app: Application = express()

app.use(express.json())
app.use(cors())

mongoose
  .connect(DB_URI)
  .then(() => console.log('Connected to AC Automatic DB!'))
  .catch(() => 'Failed to connect to DB')

app.use('/api/devices', deviceRouter)

app.use('/api/users', userRouter)

app.use('/api/rooms', roomRouter)

app.listen(PORT, () => {
  console.log('SERVER IS UP ON PORT:', PORT)
})
