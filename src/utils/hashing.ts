import bcrypt from 'bcryptjs'

export const hashPassword = (password: string) => {
  const HASH_ROUND = 10
  return bcrypt.hashSync(password, HASH_ROUND)
}

// decode
export const checkPassword = (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword)
}
