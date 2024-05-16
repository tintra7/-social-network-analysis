import express from 'express'

import userController from '@/controllers/userController'

const router = express.Router()

router.get('/:userId', userController.getUserById)

router.post('/', userController.createUser)

export default router
