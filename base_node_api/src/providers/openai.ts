import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function setContext() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente útil.",
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

export async function conversation(prompt: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
          Você é um assistente útil.
          ${prompt}
          `,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

export async function fineTuning() {}

export async function assistant(user_prompt: string) {
  const helpfulassistant = await openai.beta.assistants.retrieve(
    "asst_4a05agdwpfqBZy2XyvoGMp3d",
  );

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: user_prompt,
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: helpfulassistant.id,
  });

  let thread_conversation: any = {};

  if (run.status === "completed") {
    const messages: any = await openai.beta.threads.messages.list(
      run.thread_id,
    );

    for (const message of messages.data.reverse()) {
      thread_conversation[message.role] = message.content[0].text.value;
    }

    return thread_conversation;
  } else {
    console.log(run.status);
  }
}
