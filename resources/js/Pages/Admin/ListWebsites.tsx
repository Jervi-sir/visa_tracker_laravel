import { Button } from "@/Components/ui/button";
import AdminLayout from "./AdminLayout";
import { useWebsites, WebsitesProvider } from "./WebsitesContext";
import { WebsitesTable } from "./WebsitesTable";

export default function Page({ websites, openedCount, closedCount, confirmedCount, unconfirmedCount, pagination }) {
  return (
    <AdminLayout title="Admin">
      <WebsitesProvider
        initWebsites={websites}
        initOpenedCount={openedCount}
        initClosedCount={closedCount}
        initConfirmedCount={confirmedCount}
        initUnconfirmedCount={unconfirmedCount}
        initPagination={pagination}
      >
        <Content />
      </WebsitesProvider>
    </AdminLayout>
  )
}

const Content = () => {
  const {
    styleTheCounter,
    websites,
    openedCount,
    closedCount,
    confirmedCount,
    unconfirmedCount
    
  } = useWebsites();
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <WebsiteCardList websites={websites} /> */}
          <div className="flex auto-rows-min justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted/50 p-2">
                <h1>{ unconfirmedCount } <small className="text-red-600"> Not Confirmed</small></h1>
              </div>
              <div className="rounded-xl bg-muted/50 p-2">
                <h1>{ confirmedCount } <small className="text-green-700"> Confirmed</small></h1>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="rounded-xl bg-muted/50 p-2">
                <h1>{ openedCount } <small className="text-green-700"> Opens</small></h1>
              </div>
              <div className="rounded-xl bg-muted/50 p-2">
                <h1>{ closedCount } <small className="text-red-600"> Closed</small></h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-h-[100vh] h-full flex-1 rounded-xl bg-muted/50 md:min-h-min p-2">
            <WebsitesTable
              websites={websites}
              openedCount={openedCount}
              closedCount={closedCount}
            />
          </div>
        </div>
        
    </>
  )
}