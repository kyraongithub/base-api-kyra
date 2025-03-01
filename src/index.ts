import { httpServer } from './app'

const portHttp = process.env.HTTP_PORT

httpServer.listen(portHttp, () => console.log(`Server is listening on port ${portHttp}!`))
