import { Router } from 'express'
import { routerAuth } from '../services/auth'
import { routerUser } from '../services/users'

const _routes: [string, Router][] = [
  ['/auth', routerAuth],
  ['/users', routerUser]
]

export { _routes }
