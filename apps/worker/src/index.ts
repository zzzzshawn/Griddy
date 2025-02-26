import { Hono } from 'hono'
import { generate } from './routes/generate'
import { image } from './routes/images'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


const routes = app.route('/generate', generate).route('/images', image)

export type APIResponses = typeof routes
export default app
