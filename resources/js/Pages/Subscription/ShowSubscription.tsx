import { Award, BellIcon, Check, CheckIcon, CreditCard, MoveRight } from "lucide-react"
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
import { Link, usePage } from "@inertiajs/react"
import { formatDateTime, formatSubscriptionDate } from "@/utils/formatDateTime"

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
  const { auth } = usePage().props;

  return (
    <>
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-start space-x-4 rounded-md border p-4">
            <small>Valid until:</small>
            <div className="flex-1 space-y-1">
              <p className="text-lg font-medium leading-none">
                {
                  auth.user.is_subscribed
                  ?
                  <span className="text-green-400">
                    {formatSubscriptionDate(auth.user.current_payment_date)}
                  </span>
                  :
                  <span className="text-orange-400">
                    Not Subscriber
                  </span>
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
const OfferCard = () => {
  const { auth } = usePage().props;

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
          <div
            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1 flex flex-col gap-2">
              <span className="text-sm font-medium leading-none">Payment with</span>
              <div className="flex gap-2 items-center">
                <Button size="sm">
                  <img src="https://pay.chargily.com/test/images/logo.svg" style={{ height: 20 }} />
                </Button>
                <span>(</span>
                <Button size="sm">
                  <img src="https://seeklogo.com/images/B/baridimob-logo-2E48D2A2FB-seeklogo.com.png" style={{ height: 20 }} />
                </Button>
                <Button size="sm">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxNjrATM27CwtAVk1AxGAaeYvs368CaItQGw&s" style={{ height: 20 }} />
                </Button>
                <span>)</span>
              </div> 
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {
          auth.user.is_subscribed
          ?
          <Button className="w-full" variant="outline">
            <CheckIcon /> Already Subscribed
          </Button>
          :
          <a className="w-full" href={route('chargilypay.redirect')}>
            <Button className="w-full" variant="outline">
              <CreditCard /> Pay a Subscription
            </Button>
          </a>
        }
      </CardFooter>
    </Card>
  )
}