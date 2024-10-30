import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Loader, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { router } from "@inertiajs/react";
import { toast } from "@/hooks/use-toast";
import { formatDateTime } from "@/utils/formatDateTime";
import { WebsiteForm } from "./Actions/WebsiteForm";
import { CreateWebsiteForm } from "./Actions/CreateWebsiteFormt";
import { SelectWebsite } from "./Actions/SelectWebsite";

export const WebsitesTable = ({ websites, openedCount, closedCount }) => {
  const [selectedWebsite, setSelectedWebsite] = useState({
    id: null,
    name: null,
    url: null,
    last_checked_at: null,
    latest_status_log: null,
    pivot_id: null
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleEditClick = (website) => {
    setSelectedWebsite(website);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedWebsite) {
      await router.delete(route("websites.destroy", { id: selectedWebsite.id }), {
        preserveState: false, // Add this line
        onSuccess: () => {
          toast({
            title: "Website deleted",
            description: "The website has been successfully deleted.",
          });
          setIsDialogOpen(false);
        },
        onError: (errors) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete website. Please try again.",
          });
        },
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>is Online</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead className="text-right hidden md:table-cell">Last Checked</TableHead>
            <TableHead className="text-right hidden md:table-cell">Last Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {websites.map((website) => (
            <TableRow key={website.id}>
              <TableCell className="font-medium">{website.name}</TableCell>
              <TableCell>{
                website.is_online
                  ? <span className="text-green-700">Open</span>
                  : <span className="text-red-600">Closed</span>
              }</TableCell>
              <TableCell className="hidden md:table-cell">{website.url}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{formatDateTime(website.last_checked_at)}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{website.latest_status_log}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleEditClick(website)}
                >
                  <Trash size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell colSpan={3}>
            <span>{ openedCount } Opened</span>
            <span className="px-5"> / </span>
            <span>{ closedCount } Closed</span>
          </TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>
      <div className="mt-auto">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsCreateDialogOpen(true)}
        >Add New Site</Button>
      </div>
      {/* Show Website Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <WebsiteForm website={selectedWebsite} onDelete={handleDelete} />
        </DialogContent>
      </Dialog>
      {/* Create Website Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {/* <CreateWebsiteForm onCreated={() => setIsCreateDialogOpen(false)} /> */}
          <SelectWebsite onCreated={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
};

