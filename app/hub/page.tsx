import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { HubInfoPopover } from "@/components/hub/info-popover/dynamic"
import { HubModals } from "@/components/hub/modals"
import { FetchedHubTable } from "@/components/hub/table/fetched"

interface Props {
  searchParams: {
    action: string | undefined
    sourceIds: string | undefined
    page: string | undefined
  }
}

const Page = async ({ searchParams }: Props) => {
  return (
    <main className="flex min-h-screen flex-col px-4 sm:px-16 pb-10 pt-20">
      <div className="flex sm:items-start sm:justify-between mb-5 gap-2.5 flex-col sm:flex-row">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl w-max">Your Knowledge Hub</h1>
          <HubInfoPopover />
        </div>
      </div>
      <div className="mx-auto w-full">
        <Suspense
          fallback={<Skeleton className="w-full h-96 rounded-md border" />}
          key={`hub-${searchParams.page}`}
        >
          <FetchedHubTable page={searchParams.page} />
        </Suspense>
      </div>
      <Suspense
        key={`${searchParams.action}-${searchParams.sourceIds}`}
        fallback={<></>}
      >
        <HubModals
          sourceIds={searchParams.sourceIds}
          action={searchParams.action}
        />
      </Suspense>
    </main>
  )
}

export default Page
