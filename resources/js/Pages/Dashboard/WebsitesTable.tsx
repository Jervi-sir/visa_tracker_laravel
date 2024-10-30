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
import { CloudMoon, Delete, DeleteIcon, Loader, Trash } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { formatDateTime } from "@/utils/formatDateTime";

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
          <CreateWebsiteForm onCreated={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
};

/*
|--------------------------------------------------------------------------
| Show site dialog
|--------------------------------------------------------------------------
*/

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Website Name must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL (e.g., https://example.com)",
  }),
  pivotId: z.number(),
})

const WebsiteForm = ({ website, onDelete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: website?.name || "",
      url: website?.url || "",
      pivotId: website?.pivot_id
    },
  });

  useEffect(() => {
    if (website) {
      form.reset({
        name: website.name || "",
        url: website.url || "",
        pivotId: website.pivot_id
      });
    }
  }, [website, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)

    router.post(route('websites.update', { id: website.id }), data, {
      onSuccess: () => {
        toast({
          title: "Website has been Updated.",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),

        })
        form.reset()
      },
      onError: (errors) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add website. Please try again.",
        })
      },
      onFinish: () => setIsSubmitting(false)
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <DialogHeader>
            <DialogTitle>Edit Website</DialogTitle>
            <DialogDescription>
              Make changes to this website's details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input disabled {...form.register("name")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">Url</Label>
              <Input disabled {...form.register("url")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Latest Check</Label>
              <Input disabled value={website?.last_checked_at || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Latest Status</Label>
              <Input disabled value={website?.latest_status_log || ""} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <div className="grid grid-cols-4 items-center gap-4 w-full">
              <div></div>
              <div className="col-span-3">
                <Button
                  className="w-full"
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setIsDeleting(true);
                    onDelete()
                  }}
                  disabled={isDeleting}
                >
                  {
                    isDeleting
                      ? <Loader className="animate-spin" />
                      : 'Delete'
                  }
                </Button>
              </div>

              {/* <Button type="submit" disabled={isSubmitting} className="col-span-3">
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button> */}
            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

/*
|--------------------------------------------------------------------------
| Create new site dialog
|--------------------------------------------------------------------------
*/

const CreateFormSchema = z.object({
  name: z.string().min(2, {
    message: "Website Name must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL (e.g., https://example.com)",
  }),
})

const CreateWebsiteForm = ({ onCreated = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: "",
      url: ""
    },
  });

  function onSubmit(data: z.infer<typeof CreateFormSchema>) {
    setIsSubmitting(true)

    router.post(route('websites.store'), data, {
      preserveState: false, // Add this line
      onSuccess: () => {
        toast({
          title: "Website has been added to tracking.",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),

        })
        onCreated();    // To hide the modal
        form.reset()
      },
      onError: (errors) => {
        // Check for flash error message
        const errorMessage = (router as any).page.props.flash?.error || 
                           Object.values(errors).join('\n') ||
                           "Failed to add website. Please try again.";
        
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })

      },
      onFinish: () => setIsSubmitting(false)
    })
  }
  // Handle clear button
  const handleClear = () => {
    form.reset()
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <>
            <DialogHeader>
              <DialogTitle>Add Tracker</DialogTitle>
              <DialogDescription>Keep tracking this website.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              {/* Website Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>Website Name</FormDescription>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Website URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>Website Name</FormDescription>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Start Tracking"}
              </Button>
            </DialogFooter>
          </>
        </form>
      </Form>
    </>
  )
}