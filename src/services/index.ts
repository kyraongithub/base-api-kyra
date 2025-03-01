import { Application } from 'express'
import { _routes } from '../constant/routes'

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(`/api/v1${url}`, router)
  })
}
