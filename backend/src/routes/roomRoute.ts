import express from 'express'

import roomController from '@/controllers/roomController'

const router = express.Router()

router.get('/', roomController.getAllRooms)

router.get('/:roomId', roomController.getSingleRoom)

router.post('/', roomController.createRoom)

router.put('/:roomId', roomController.updateRoomById)

router.delete('/:roomId', roomController.deleteRoomById)

export default router
