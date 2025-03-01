import { Router } from 'express'
import { getUsersRequest, getUserByIdRequest, updateUserRequest, deleteUserRequest } from './user.controller'
import { verifyToken } from '../../middleware/authorization'

export const routerUser: Router = Router()

routerUser.get('/', verifyToken, getUsersRequest)
routerUser.get('/:userId', verifyToken, getUserByIdRequest)
routerUser.put('/:userId', verifyToken, updateUserRequest)
routerUser.delete('/:userId', verifyToken, deleteUserRequest)
