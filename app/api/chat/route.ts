import { cache } from "react"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs"
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";

import type { Database } from "@/lib/database.types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
})

export const runtime = "edge"
const embeddings = new OpenAIEmbeddings()

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: { content: string; role: string }[]
  }

  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
  const threeLastUserMessages = userMessages.slice(-3).reverse().join('\n ')
  
  const supabase = createServerSupabaseClient()
  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabase,
    similarityK: 2,
    keywordK: 2,
    tableName: "summaries",
    similarityQueryName: "match_summaries",
    keywordQueryName: "kw_match_summaries",
  });
  const results = await retriever.getRelevantDocuments(threeLastUserMessages);

  const messagesWithContext = messages.map((m, idx) => {
    if (idx !== messages.length - 1) return m
    const context = results.map((r) => r.pageContent).join("\n\n ")
    return {
      ...m,
      content: `${m.content}\n\nContext: ${context}`,
    }
  })
  const messagesWithSystemAndContext = [
    {
      role: "system",
      content:
        'You are a helpful assitant that provided answers based on the context. If the context does not contain an answer - you reply with "I dont know"',
    },
    ...messagesWithContext,
  ]

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    stream: true,
    messages: messagesWithSystemAndContext as ChatCompletionMessageParam[],
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}