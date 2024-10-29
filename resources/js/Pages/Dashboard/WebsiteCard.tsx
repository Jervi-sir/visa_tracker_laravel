import { Card, CardContent, CardHeader, CardTitle, } from "@/Components/ui/card"
import { Earth } from "lucide-react";

export const WebsiteCard = ({ website, index }) => {
  return (
    <Card className="rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          { website.name } 
        </CardTitle>
        <Earth size={20} />
      </CardHeader>
      <CardContent>
      { 
        website.is_online 
        ? <div className="text-2xl font-bold text-green-700">Open</div>
        : <div className="text-2xl font-bold text-red-600">Close</div>
      }

      
      <p className="text-xs text-muted-foreground break-all">
          { website.url }
        </p>
      </CardContent>
    </Card>
  );
};