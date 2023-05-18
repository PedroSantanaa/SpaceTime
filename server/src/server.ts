import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

// HTTP Method: GET,POST,PUT,PATCH,DELETE
app.register(cors, {
  origin: true,
})
app.register(memoriesRoutes)
// API RESTful
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
