import { Request, Response } from 'express'
import { getUsers, getUserById, updateUser, deleteUser } from './user.model'
import { isString } from '../../utils/isString'

export const getUsersRequest = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const per_page = parseInt(req.query.per_page as string) || 6

    const { err, result, total } = await getUsers(page, per_page)

    if (err) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }

    return res.status(200).json({
      status: true,
      statusCode: 200,
      page,
      per_page,
      total,
      total_pages: Math.ceil(total / per_page),
      data: result
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const getUserByIdRequest = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10)
    const { err, result } = await getUserById(userId)
    if (err) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(200).json({ status: true, statusCode: 200, user: result })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const updateUserRequest = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10)
    let query = ''
    const keys = Object.keys(req.body)
    keys.map((key: string, index: number) => {
      if (index === keys.length - 1) {
        query += `${key} = ${isString(req.body[key])}`
      } else {
        query += `${key} = ${isString(req.body[key])},`
      }
    })
    query = query.slice(0, -1)
    const { err, result } = await updateUser(userId, query)
    if (err) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(200).json({ status: true, statusCode: 200, message: 'User updated', user: result })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}

export const deleteUserRequest = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10)
    const { err, result } = await deleteUser(userId)
    if (err) {
      return res.status(400).json({ status: false, statusCode: 400, message: err.message })
    }
    return res.status(200).json({ status: true, statusCode: 200, message: 'User deleted', user: result })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ status: false, statusCode: 500, message: error.message })
  }
}
