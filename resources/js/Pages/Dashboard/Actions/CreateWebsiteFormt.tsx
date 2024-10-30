
import { Button } from "@/Components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateFormSchema = z.object({
  name: z.string().min(2, {
    message: "Website Name must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL (e.g., https://example.com)",
  }),
})

export const CreateWebsiteForm = ({ onCreated = null }) => {
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
