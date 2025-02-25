import { Blob } from "@cloudflare/workers-types";
import { zValidator } from "@hono/zod-validator";
import { HfInference } from "@huggingface/inference";
import { Env, generateImageSchema } from "@repo/types/index";
import { Hono } from "hono";
import { customAlphabet } from "nanoid";
import { createS3Client } from "../lib/r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { HTTPException } from "hono/http-exception";
import { dbClient } from "../db";
import { getEmbeddings } from "../lib/embedding";
import { images } from "../db/schema";

const app = new Hono<{ Bindings: Env }>();

app.post("/", zValidator("json", generateImageSchema), async (c: any) => {
  try {
    const body = c.req.valid("json");
    const prompt = body.prompt;

    const model = new HfInference(c.env.HUGGINGFACE_KEY);

    const blobImage = (await model.request({
      model: "alvdansen/littletinies",
      inputs: prompt,
    })) as Blob;

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

    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      body: blobImage,
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

    const db = dbClient(c.env);

    //? save to db next

    const embedding = await getEmbeddings({
      env: c.env,
      text: prompt,
    });

    const embeddingBuffer = Buffer.from(new Float32Array(embedding).buffer);

    await db.insert(images).values({
      id: imageId,
      prompt,
      embedding: embeddingBuffer,
    })

    const imageArrayBuffer = await blobImage.arrayBuffer();

    return c.body(imageArrayBuffer, 200, {
      "Content-Type": "image/jpeg",
      "Content-Disposition": `inline; filename="${prompt}.jpeg"`,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPException) {
      throw new HTTPException(400, {
        message: error.message,
      });
    }

    throw new HTTPException(500, {
      message:
        "Unknown Generate Image error occurred. Please try again or raise an issue on GitHub.",
    });
  }
});

export { app as generate };
