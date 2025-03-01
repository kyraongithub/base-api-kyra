import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 1 * 1 * 1, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})
