import { Database } from "./database.types"

export type LinkMetadata = {
  title: string
  description: string
  icon: string
  url: string
}

export type SourceEntity = Database["public"]["Tables"]["sources"]["Row"]

export type StatusEnumType = Database["public"]["Enums"]["status"]

export type SummaryEntity = Database["public"]["Tables"]["summaries"]["Row"]
