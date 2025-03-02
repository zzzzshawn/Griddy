import { Hono } from "hono";
import { cors } from "hono/cors";
import { generate } from "./routes/generate";
import { image } from "./routes/images";

const app = new Hono();

// Add CORS middleware
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URLs
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const routes = app.route("/generate", generate).route("/images", image);

export type APIResponses = typeof routes;
export default app;
