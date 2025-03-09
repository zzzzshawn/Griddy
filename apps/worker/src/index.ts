import { Hono } from "hono";
import { cors } from "hono/cors";
import { generate } from "./routes/generate";
import { image } from "./routes/images";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3001", "https://griddy-v1.vercel.app"], 
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Griddy!");
});

const routes = app.route("/generate", generate).route("/images", image);

export type APIResponses = typeof routes;
export default app;
