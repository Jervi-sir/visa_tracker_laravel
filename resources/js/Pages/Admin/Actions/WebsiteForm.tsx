import { Button } from "@/Components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/Components/ui/checkbox"

const FormSchema = z.object({
  id: z.number(),
  name: z.string().min(2, { message: "Website Name must be at least 2 characters.", }),
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)", }),
  used_function: z.string().nullable(),
  confirmed: z.boolean(),
})

export const WebsiteForm = ({ website, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: website.id,
      name: website?.name || "",
      url: website?.url || "",
      used_function: website?.used_function || "",
      confirmed: website?.confirmed
    },
  });

  useEffect(() => {
    if (website) {
      form.reset({
        id: website.id,
        name: website.name || "",
        url: website.url || "",
        used_function: website?.used_function || "",
        confirmed: website?.confirmed
      });
    }
  }, [website, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    console.log('bruh: ', null);

    router.post(route('websites.approveWebsite', { id: website.id }), data, {
      onSuccess: () => {
        toast({
          title: "Website has been Updated.",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),

        })
        onSuccess();
        form.reset();
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
          <div className="grid gap-4 py-4">
            {/* Website Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input {...form.register("name")} className="col-span-3" />
                  </div>
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">Url</Label>
                    <Input {...form.register("url")} className="col-span-3" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Website Used Function */}
            <FormField
              control={form.control}
              name="used_function"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Used Function</Label>
                    <Input {...form.register("used_function")} className="col-span-3" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Website Confirm */}
            <FormField
              control={form.control}
              name="confirmed"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right"></Label>
                    <div className="col-span-3 flex gap-3 items-end">
                      <Checkbox
                        id="confirmed"
                        checked={field.value || false}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                      <Label
                        htmlFor="confirmed"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Confirm the site
                      </Label>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <div className="grid grid-cols-4 items-center gap-4 w-full">
              {/* Delete Button */}
              {/* <div className="col-span-1">
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
              </div> */}
              <div></div>
              {/* Update Button */}
              <div className="col-span-3">
                <Button
                  className="w-full"
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  {
                    isSubmitting
                      ? <Loader className="animate-spin" />
                      : 'Update'
                  }
                </Button>
              </div>

            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}