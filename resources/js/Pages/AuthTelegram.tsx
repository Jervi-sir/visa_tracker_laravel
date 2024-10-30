import { Button } from "@/Components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { LoginButton } from '@telegram-auth/react';

export default function Page() {

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            In order to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="grid gap-4">
            
            <Button 
              variant="outline" 
              className="w-full" 
              style={{ background: '#2097d4'}} 
              onClick={handleTelegramLoginClick}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png"
                style={{ width: 24, height: 24}} 
              />
              Continue with Telegram
            </Button>
          </div> */}
          <div>
            <LoginButton
              botUsername={'visa_trkr_bot'}
              authCallbackUrl="https://8d69-41-99-134-21.ngrok-free.app/auth/telegram"
              buttonSize="large"
              cornerRadius={10}
              showAvatar={true}
              lang="en"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
