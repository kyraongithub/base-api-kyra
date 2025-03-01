import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({ status: false, statusCode: 403, message: 'unauthorized' })
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: Error, user: any) => {
    if (err) return res.status(403).json({ status: false, statusCode: 403, message: err.message })
    req.user = user
    next()
  })
}

export { verifyToken }
