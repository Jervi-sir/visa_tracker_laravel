import { Button } from "@/Components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Form } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Website Name must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL (e.g., https://example.com)",
  }),
  pivotId: z.number(),
})

export const WebsiteForm = ({ website, onDelete }) => {
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