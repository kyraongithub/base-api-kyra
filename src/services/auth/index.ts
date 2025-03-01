import { Router } from 'express'
import {
  loginRequest,
  registerRequest,
  isExpiredToken,
  logoutRequest,
  changePasswordRequest,
  refreshRequest
} from './auth.controller'
import { apiLimiter } from '../../middleware/rateLimit'
import { verifyToken } from '../../middleware/authorization'

export const routerAuth: Router = Router()

routerAuth.post('/login', apiLimiter, loginRequest)
routerAuth.post('/register', apiLimiter, registerRequest)
routerAuth.get('/isexpired', apiLimiter, verifyToken, isExpiredToken)
routerAuth.delete('/logout', apiLimiter, verifyToken, logoutRequest)
routerAuth.put('/change-password', apiLimiter, verifyToken, changePasswordRequest)
routerAuth.post('/refresh', apiLimiter, refreshRequest)
