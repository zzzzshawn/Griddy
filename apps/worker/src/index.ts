import { Hono } from 'hono'
import { generate } from './routes/generate'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/generate', generate)

export default app
