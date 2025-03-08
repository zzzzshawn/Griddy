import { Env } from "@repo/types/index";
import { config } from "dotenv";

config({ path: ".dev.vars" });

interface EmbeddingResponse {
  result: {
    data: number[][];
  };
}

interface GetEmbeddingsProps {
  env: Env;
  text: string;
}

export async function getEmbeddings({
  env,
  text,
}: GetEmbeddingsProps): Promise<number[]> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.R2_ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [text],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to generate embeddings: ${await response.text()}`
      );
    }

    const result = (await response.json()) as EmbeddingResponse;
    return result.result.data[0] || [];
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return [];
  }
}
