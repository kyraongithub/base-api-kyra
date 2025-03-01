import { Response } from 'express'
import { AuthCheckToken, ChangePassword, DBauthLogin, DBauthRegister, DBauthRefresh } from './auth.model'
import { CustomRequest } from '../../utils/CustomRequest'

export const loginRequest = async (req: CustomRequest, res: Response) => {
  try {
    const { err, result } = await DBauthLogin(req.body, res)
    if (err && err.message) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(200).json({ status: true, statusCode: 200, message: 'Login success', user: result })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const registerRequest = async (req: CustomRequest, res: Response) => {
  try {
    const { err, result } = await DBauthRegister(req.body)
    if (err && err.message) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(201).json({ status: true, statusCode: 201, message: 'Registration success', user: result })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const isExpiredToken = async (req: CustomRequest, res: Response) => {
  try {
    const { err, result } = await AuthCheckToken(req, res)
    if (err) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(200).json({ status: true, statusCode: 200, message: 'Token is valid', user: result })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const logoutRequest = async (req: CustomRequest, res: Response) => {
  try {
    res.clearCookie('refresh_token')
    return res.status(200).json({ status: true, statusCode: 200, message: 'Logout success' })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const changePasswordRequest = async (req: CustomRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body
    const { err } = await ChangePassword(oldPassword, newPassword, req.user.user_id)
    if (err) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(200).json({ status: true, statusCode: 200, message: 'Change password success' })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const refreshRequest = async (req: CustomRequest, res: Response) => {
  try {
    const { err, result } = await DBauthRefresh(req, res)
    if (err) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(200).json({ status: true, statusCode: 200, message: 'Token refreshed', user: result })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}
