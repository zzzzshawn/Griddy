import { zValidator } from "@hono/zod-validator";
import { Env, queryImageSchema } from "@repo/types/index";
import { Hono } from "hono";
import { dbClient } from "../db";
import { getEmbeddings } from "../lib/embedding";

const app = new Hono<{ Bindings: Env }>();

app.get("/", zValidator("query", queryImageSchema), async (c) => {
  const query = c.req.query("query");
  const cursor = c.req.query("cursor");

  const pageAsNumber = Number(cursor);
  const fallbackPage =
    Number.isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const limit = 10;
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

  const db = dbClient(c.env);

  let embeddingArray: number[] | undefined = undefined;

  if (query) {
    const embedding = await getEmbeddings({
      env: c.env,
      text: query,
    });

    embeddingArray = embedding;
  }

  console.log("embedding set");

  let data: any[] = [];
  let count = 0;

  console.log("process start");
  if (embeddingArray) {
    data = await db.$queryRawUnsafe(
      `
      WITH vector_comparison AS (
        SELECT id, prompt,
          1 - SQRT(
            (SELECT SUM(POWER(v1.elem - v2.elem, 2))
            FROM UNNEST(embedding) WITH ORDINALITY AS v1(elem, idx)
            JOIN UNNEST($1::float8[]) WITH ORDINALITY AS v2(elem, idx) ON v1.idx = v2.idx)
          ) as similarity
        FROM "Image"
      )
      SELECT id, prompt, similarity
      FROM vector_comparison
      WHERE similarity >= 0.5
      ORDER BY similarity DESC
      LIMIT $2 OFFSET $3
      `,
      embeddingArray,
      limit,
      offset
    );

    const countResult: any = await db.$queryRawUnsafe(
      `
      WITH vector_comparison AS (
        SELECT 1
        FROM "Image"
        WHERE 1 - SQRT(
          (SELECT SUM(POWER(v1.elem - v2.elem, 2))
          FROM UNNEST(embedding) WITH ORDINALITY AS v1(elem, idx)
          JOIN UNNEST($1::float8[]) WITH ORDINALITY AS v2(elem, idx) ON v1.idx = v2.idx)
        ) >= 0.5
      )
      SELECT COUNT(*) FROM vector_comparison
      `,
      embeddingArray
    );

    count = parseInt(countResult[0]?.count ?? "0");
  } else {
    data = await db.image.findMany({
      select: {
        id: true,
        prompt: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    count = await db.image.count();
  }
  return c.json({
    data,
    count,
  });
});

export { app as image };
