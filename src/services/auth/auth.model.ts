import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { hashPassword, checkPassword } from '../../utils/hashing'
import generateIdNumber from '../../utils/randomizerId'
import { ACCESS_LIMIT, REFRESH_LIMIT } from '../../config/jwt.config'
import pool from '../../config/db.config'
import { UserInterface } from '../../types/user.types'

const jwtToken = (user: UserInterface) => {
  const accessToken = jwt.sign({ user_id: user.user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_LIMIT })
  const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_LIMIT
  })
  return { accessToken, refreshToken, ...user }
}

const DBauthLogin = async (userInput: UserInterface, res: Response): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE email = $1', [userInput.email], (err: Error, result: any) => {
      if (err) return reject(err)
      if (result.rows.length === 0) resolve({ err: new Error('User not found'), result: null })
      if (result.rows.length > 0) {
        const user = result.rows[0]
        if (checkPassword(userInput.password, user.password)) {
          const userQuery = 'SELECT user_id, email, display_name FROM users WHERE user_id = $1'
          pool.query(userQuery, [user.user_id], (error: any, resultQuery: any) => {
            if (error) return reject(error)
            const tokens = jwtToken(resultQuery.rows[0])
            res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true })
            resolve({ err, result: tokens })
          })
        } else {
          resolve({ err: new Error('Password not match'), result: null })
        }
      }
    })
  })
}

const DBauthRegister = async (userInput: UserInterface): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    const hashedPassword = hashPassword(userInput.password)
    pool.query(
      'INSERT INTO users (user_id, email, display_name, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [generateIdNumber(), userInput.email, userInput.displayName || userInput.email, hashedPassword],
      (err: Error, result: any) => {
        if (err) return reject(err)
        resolve({ err: null, result: result.rows[0] })
      }
    )
  })
}

const DBauthRefresh = async (req: Request, res: Response): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    try {
      const refreshToken: any = req.cookies.refresh_token
      if (!refreshToken) {
        resolve({ err: new Error('No refresh token available'), result: null })
      }
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: Error, user: UserInterface) => {
        if (err) resolve({ err: new Error(err.message), result: null })
        const userQuery = 'SELECT * FROM users WHERE user_id = $1'
        pool.query(userQuery, [user.user_id], (error: any, resultQuery: any) => {
          if (error) return reject(error)
          const tokens = jwtToken(resultQuery.rows[0])
          res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true })
          resolve({ err, result: tokens })
        })
      })
    } catch (err) {
      resolve({ err: new Error(err.message), result: null })
    }
  })
}

const AuthCheckToken = async (req: Request, res: Response): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    const access = req.query.access as string
    jwt.verify(access, process.env.ACCESS_TOKEN_SECRET, async (err: Error, user: UserInterface) => {
      if (err) {
        const refresh = await DBauthRefresh(req, res)
        resolve({ err: refresh.err, result: refresh.result })
      } else {
        resolve({ err: null, result: { statusUser: 'ready' } })
      }
    })
  })
}

const ChangePassword = (
  oldPassword: string,
  newPassword: string,
  userId: string
): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE user_id = $1', [userId], (err: Error, result: any) => {
      if (err) return reject(err)
      if (result.rowCount > 0) {
        const user = result.rows[0]
        if (checkPassword(oldPassword, user.password)) {
          pool.query(
            'UPDATE users SET password = $1, updated_at = current_timestamp WHERE user_id = $2',
            [hashPassword(newPassword), userId],
            (err: Error, result: any) => {
              if (err) return reject(err)
              resolve({ err: null, result: result })
            }
          )
        } else {
          resolve({ err: new Error('Old password not match'), result: null })
        }
      } else {
        resolve({ err: new Error('User not found'), result: null })
      }
    })
  })
}

export { AuthCheckToken, DBauthLogin, DBauthRegister, DBauthRefresh, ChangePassword }
