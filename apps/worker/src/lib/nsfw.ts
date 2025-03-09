import { Env } from "@repo/types/index";
import { HTTPException } from "hono/http-exception";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface CheckTextProps {
  c?: any;
  text: string;
}

export async function isNSFW({ c, text }: CheckTextProps) {
  const apiKey = c.env ? c.env.GEMINI_API_KEY : process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new HTTPException(500, {
      message: "GEMINI_API_KEY is not configured.",
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

  try {
    const prompt = `You are an AI system responsible for detecting inappropriate or unsafe-for-work (NSFW) language in text. When provided with a sentence or passage, your task is to analyze the text and determine if it contains any words or phrases that are considered sexually inappropriate or explicit.

    If the text contains any such words or phrases, return false.
    If the text is free of inappropriate language, return true.
    You must only return a boolean value: true or false. Ensure that your analysis is thorough and accurate, considering common variations and potential misspellings of inappropriate words.

    Text to analyze: "${text}"`;

    const result = await model.generateContent(prompt);
    console.log(result);
    const response = result.response.text().trim().toLowerCase();
    console.log(response);

    if (response !== "true") {
      c.res.text("At this point just go to pornhub mate.", 400);
      throw new HTTPException(400, {
        message: "At this point just go to pornhub mate.",
      });
    }
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPException) {
      throw new HTTPException(400, {
        message: error.message,
      });
    }

    throw new HTTPException(500, {
      message:
        "Unknown NSFW error occurred. Please try again or raise an issue on GitHub.",
    });
  }
}
