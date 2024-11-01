import { cn } from "@/lib/utils"
import ClientLayout from "../Layout/ClientLayout"
import { formatDateTime } from "@/utils/formatDateTime"
import { Bell } from "lucide-react"

export default function Page({ notifications, pagination }) {
  return (
    <ClientLayout title="Notifications">
      <Content notifications={notifications} pagination={pagination} />
    </ClientLayout>
  )
}

const Content = ({ notifications, pagination }) => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <WebsiteCardList websites={websites} /> */}
          <div className="flex flex-col gap-2 p-2 min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          {
            notifications.map((notification, index) => (
              <button
                key={index}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                )}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 ">
                      <Bell size={14} />
                      <div className="font-semibold"> {notification.content}</div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {formatDateTime(notification.created_at)}
                    </div>
                  </div>
                </div>
              </button>

            ))
          }
          </div>
        </div>
        
    </>
  )
}

