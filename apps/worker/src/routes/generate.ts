import { Blob } from "@cloudflare/workers-types";
import { zValidator } from "@hono/zod-validator";
import { HfInference } from "@huggingface/inference";
import { Env, generateImageSchema } from "@repo/types/index"
import { Hono } from "hono"
import { Bindings } from "hono/types"
import { customAlphabet } from "nanoid";
import { createS3Client } from "../lib/r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{Bindings: Env}>();

app.post('/', 
    zValidator("json", generateImageSchema),
    async(c: any)=> {
    try {
        const body = c.req.valid('json');
        const prompt = body.prompt;

        const model = new HfInference(c.env.HUGGINGFACE_KEY);

        const blobImage = (await model.request({
            model: 'alvdansen/littletinies',
            inputs: body.prompt
        })) as Blob


        const imageId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz',10);


        const r2 = createS3Client(c.env);

        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
              Bucket: c.env.R2_BUCKET_NAME,
              Key: `images/${imageId}.jpeg`,
            }),
            { expiresIn: 60 },
          )


          const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            body: blobImage,
            headers: {
              "Content-Type": blobImage.type,
            },
          })

          if (!uploadResponse.ok) {
            throw new HTTPException(500, {
              message:
                "Failed to upload image. Please try again or raise an issue on GitHub.",
            })
          }

          const db = dbClient(c.env)

        

    } catch (error) {
        console.log(error)
    }
})