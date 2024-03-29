import { cache } from "react"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

export async function GET(
  request: NextRequest,
  { params: { user_id } }: { params: { user_id: string } }
) {
  const header = request.headers.get("x-api-key")
  if (header !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id is required" }), {
      status: 400,
    })
  }

  const supabase = createServerSupabaseClient()

  const { data: summaries, error } = await supabase
    .from("summaries")
    .select(`created_at, content, metadata->url, metadata->title`)
    .eq("metadata->>user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify(summaries), {
    status: 200,
  })
}
