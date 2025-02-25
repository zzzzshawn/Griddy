import { Hono } from 'hono'
import { generate } from './routes/generate'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


const routes = app.route('/generate', generate)

export type APIResponses = typeof routes
export default app
