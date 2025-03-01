import pool from '../../config/db.config'

export const getUsers = async (page: number, per_page: number): Promise<{ err: Error; result: any; total: number }> => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * per_page

    pool.query('SELECT COUNT(*) AS total FROM users', (countErr: Error, countResult: any) => {
      if (countErr) return reject(countErr)

      const total = parseInt(countResult.rows[0]?.total || 0)

      pool.query(
        'SELECT user_id, email FROM users LIMIT $1 OFFSET $2',
        [per_page, offset],
        (err: Error, result: any) => {
          if (err) return reject(err)
          resolve({ err: null, result: result.rows, total })
        }
      )
    })
  })
}

export const getUserById = async (userId: number): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT user_id, email FROM users WHERE user_id = $1', [userId], (err: Error, result: any) => {
      if (err) return reject(err)
      if (result.rows.length === 0) {
        resolve({ err: new Error('User not found'), result: null })
      } else {
        resolve({ err: null, result: result.rows[0] })
      }
    })
  })
}

export const updateUser = async (userId: number, query: string): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE users SET ${query} WHERE id = $1`, [userId], (err: Error, result: any) => {
      if (err) return reject(err)
      if (result.rows.length === 0) {
        resolve({ err: new Error('User not found'), result: null })
      } else {
        resolve({ err: null, result: result.rows[0] })
      }
    })
  })
}

export const deleteUser = async (userId: number): Promise<{ err: Error; result: any }> => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM users WHERE id = $1', [userId], (err: Error, result: any) => {
      if (err) return reject(err)
      if (result.rows.length === 0) {
        resolve({ err: new Error('User not found'), result: null })
      } else {
        resolve({ err: null, result: result.rows[0] })
      }
    })
  })
}
