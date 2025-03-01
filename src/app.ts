/* eslint-disable no-unused-vars */
/* eslint-disable node/no-path-concat */
import flash from 'connect-flash'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { Application } from 'express'
import session from 'express-session'
import methodOverride from 'method-override'
import { routes } from './services'

import bodyParser from 'body-parser'
import helmet from 'helmet'

import proxy from 'express-http-proxy'
import http from 'http'
import path from 'path'

// Boot express
const app: Application = express()
app.use(express.json())

// Access Handling
app.use(cors())
app.use(helmet())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Cross-Origin-Resource-Policy', '*')
  next()
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.use('/assets', express.static(path.join(__dirname, 'assets')))

// Error handling middleware for static files
app.use('/assets', (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.error(err)
    res.status(404).send('File not found')
  } else {
    next() // Pass control to the next middleware if no error occurred
  }
})

// Proxy requests to the external image server
app.use('/assets', proxy('external-image-server-url'))

app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

app.use(flash())

// Application routing
routes(app)

const httpServer = http.createServer(app)

export { httpServer }
