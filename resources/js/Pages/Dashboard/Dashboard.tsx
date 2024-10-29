import { Button } from "@/Components/ui/button";
import ClientLayout from "../Layout/ClientLayout"
import { WebsiteCard } from "./WebsiteCard"
import { WebsitesTable } from "./WebsitesTable"

export default function Page({ websites, openedCount, closedCount }) {
  const styleTheCounter = (length) => {
    if(length <= 2) return 'text-green-300';
    if(length === 3) return 'text-orange-300';
    if(length === 4) return 'text-orange-300';
    if(length === 5) return 'text-red-700';
  }
  return (
    <ClientLayout title="List Tracked Websites">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <WebsiteCardList websites={websites} /> */}
          <div className="flex auto-rows-min justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted/50 p-2">
                <h1 className={`${styleTheCounter(websites.length)}`}>{ websites.length } / 5 websites</h1>
              </div>
              {
                websites.length === 5 
                &&
                <div>
                  <Button size="default" variant="destructive">Upgrade</Button>
                </div>
              }
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
          <div className="flex flex-col min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-2">
            <WebsitesTable
              websites={websites}
              openedCount={openedCount}
              closedCount={closedCount}
            />
          </div>
        </div>
    </ClientLayout>
  )
}


const WebsiteCardList = ({ websites }) => {
  return (
    <>
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {
        websites.map((website, index) => (
          <div className="rounded-xl bg-muted/50 p-1" key={index}>
            <WebsiteCard website={website} index={index} />
          </div>
        ))
      }
    </div>
    </>
  )
}