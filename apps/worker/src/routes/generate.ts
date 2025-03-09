import { zValidator } from "@hono/zod-validator";
import { Env, generateImageSchema } from "@repo/types/index";
import { Hono } from "hono";
import { customAlphabet } from "nanoid";
import { createS3Client } from "../lib/r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { HTTPException } from "hono/http-exception";
import { dbClient } from "../db";
import { getEmbeddings } from "../lib/embedding";
import { rateLimitMiddleware } from "../middleware";
import { isNSFW } from "../lib/nsfw";

const app = new Hono<{ Bindings: Env }>();

app.post(
  "/",
  zValidator("json", generateImageSchema),
  rateLimitMiddleware({
    identifier: "GENERATE_RATE_LIMITER",
    duration: 86400,
    limit: 5,
  }),
  async (c: any) => {
    try {
      const body = c.req.valid("json");
      const prompt = `${body.prompt} in a graffiti art style`;

      await isNSFW({ c: c, text: body.prompt, });

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${c.env.R2_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            num_steps: 20,
            width: 1024,
            height: 1024,
          }),
        }
      );

      if (!response.ok) {
        throw new HTTPException(
          response.status as 400 | 401 | 403 | 404 | 500,
          {
            message: await response.text(),
          }
        );
      }

      const result = await response.arrayBuffer();
      const blobImage = new Blob([result], { type: "image/png" });

      console.log("blob created");

      const generateImageId = customAlphabet(
        "1234567890abcdefghijklmnopqrstuvwxyz",
        10
      );
      
      const imageId = generateImageId();

      const r2 = createS3Client(c.env);

      const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: c.env.R2_BUCKET_NAME,
          Key: `images/${imageId}.jpeg`,
        }),
        { expiresIn: 60 }
      );

      console.log("signed url created");

      const imageArrayBuffer = await blobImage.arrayBuffer();

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: imageArrayBuffer,
        headers: {
          "Content-Type": blobImage.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new HTTPException(500, {
          message:
            "Failed to upload image. Please try again or raise an issue on GitHub.",
        });
      }

      console.log("image uploaded");

      const db = dbClient(c.env);

      console.log("db client created");

      const embedding = await getEmbeddings({
        env: c.env,
        text: body.prompt,
      });

      console.log("embeddings generated");

      if (!embedding || embedding.length === 0) {
        throw new HTTPException(500, {
          message: "Failed to generate embeddings for the image.",
        });
      }

      console.log("embeddings checked");

      await db.image.create({
        data: {
          id: imageId,
          prompt: body.prompt,
          embedding,
        },
      });

      console.log("image saved to db");

      return c.body(imageArrayBuffer, 200, {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `inline; filename="${body.prompt}.jpeg"`,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof HTTPException) {
        throw new HTTPException(error.status, {
          message: error.message,
        });
      }

      throw new HTTPException(500, {
        message:
          "Unknown Generate Image error occurred. Please try again or raise an issue on GitHub.",
      });
    }
  }
);

export { app as generate };
