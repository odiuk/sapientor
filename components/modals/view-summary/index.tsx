"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { createUrl } from "@/lib/utils"

import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog"

export interface ViewSummaryModalProps {
  isOpen: boolean
  summaries: string[] | null
  title: string | null
}

export const ViewSummaryModal = ({
  isOpen,
  summaries,
  title,
}: ViewSummaryModalProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete("action")
    newParams.delete("sourceIds")
    router.replace(createUrl(pathname, newParams), { scroll: false })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] overflow-y-scroll">
        <DialogHeader>Summary content</DialogHeader>
        <DialogDescription>
          You are viewing the summary content for <b>&quot;{title}&quot;</b> :
        </DialogDescription>
        <div className="p-1 bg-slate-100 rounded overflow-y-scroll">
          {summaries?.map((summary, idx) => (
            <p key={`summary-${idx}`} className="text-sm">
              {summary}
            </p>
          ))}
        </div>
        <DialogFooter className="mt-2.5 flex-row space-x-2 justify-end">
          <Button type="button" onClick={handleClose} className="w-28">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
