import axios from "axios";

export async function conversation(userPrompt: string) {
  const url = "https://api.unify.ai/v0/inference";
  const unifyKey = process.env.UNIFY_API_KEY;

  const headers = {
    Authorization: `Bearer ${unifyKey}`,
    "Content-Type": "application/json",
  };

  const payload = {
    model: "llama-2-70b-chat",
    provider: "anyscale",
    arguments: {
      messages: [
        {
          role: "system",
          content: `
          Você é um assistente útil.
          `,
        },
        {
          role: "assistant",
          content: `
          Você é um assistente útil
          `,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.5,
      maxTokens: 250,
      stream: true,
    },
  };

  try {
    const response = await axios.post(url, payload, {
      headers,
      responseType: "stream",
    });

    const responseData: string[] = [];

    response.data.on("data", (chunk: Buffer) => {
      const chunkStr = chunk.toString("utf-8");
      if (chunkStr.includes("choices")) {
        const part01 = chunkStr
          .split('"choices": ')[1]
          .split(', "provider"')[0];

        try {
          const parsedPart = JSON.parse(part01);
          if (Array.isArray(parsedPart) && parsedPart.length > 0) {
            responseData.push(parsedPart[0].delta.content);
          }
        } catch (error: any) {
          console.error("Erro ao fazer parsing do JSON:", error.message);
        }
      }
    });

    return new Promise((resolve, reject) => {
      response.data.on("end", () => {
        const assistantResponse = responseData.join("").trim();
        const conversationData = {
          user: userPrompt,
          assistant: assistantResponse.replace(/\【\d+:\d+†source】/g, ""),
        };
        resolve(conversationData);
      });

      response.data.on("error", (error: any) => {
        console.error("Erro durante a transmissão de dados:", error.message);
        reject(error);
      });
    });
  } catch (error: any) {
    console.error("Erro na requisição:", error.message);
    throw error;
  }
}
