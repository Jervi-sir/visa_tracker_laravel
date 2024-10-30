import { Award, BellIcon, Check, CheckIcon, MoveRight } from "lucide-react"
import ClientLayout from "../Layout/ClientLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"

export default function ShowSubscription({}) {
  return (
    <ClientLayout title="List Tracked Websites">
      <Content />
    </ClientLayout>
  )
}

const Content = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* <WebsiteCardList websites={websites} /> */}
        <div className="flex auto-rows-min justify-between gap-4">
          <SubscriptionCard />
        </div>
        <div className="flex auto-rows-min justify-between gap-4">
          <OfferCard />
        </div>
      </div>
    </>
  )
}

const SubscriptionCard = () => {
  return (
    <>
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <small>Valid until:</small>
            <div className="flex-1 space-y-1">
              <p className="text-lg font-medium leading-none">
                2024 Oct 19
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
const OfferCard = () => {
  const notifications = [
    { title: "Up to 5 website to track.", },
    { title: "Get Notified on Telegram!", },
    { title: "24/7 Tracking!", },
  ]
  return (
    <Card className={cn("w-[380px]")}>
      <CardHeader>
        <CardTitle>Only Offer</CardTitle>
        <CardDescription>Take advantage with this Only Offer.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-lg font-medium leading-none">
              5000.00 DA
            </p>
          </div>
          <Award />
        </div>
        <div>
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <CheckIcon /> Already Subscribed
        </Button>
      </CardFooter>
    </Card>
  )
}