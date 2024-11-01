import ClientLayout from "../Layout/ClientLayout"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/Components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/Components/ui/form"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"

import { Input } from "@/Components/ui/input"
import { toast } from "@/hooks/use-toast"
import { router } from "@inertiajs/react"
import { useState } from "react"
import AdminLayout from "./AdminLayout"


const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Website Name must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL (e.g., https://example.com)",
  }),
})

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  })


  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    
    router.post(route('admin.storeWebsiteSuggestion'), data, {
      onSuccess: () => {
        toast({
          title: "Website has been added to tracking.",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
    
        })
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
    <AdminLayout title="Add Website To Track">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <Card className="max-w-[550px]">
              <CardHeader>
                <CardTitle>Add Websites</CardTitle>
                <CardDescription>Suggest us website to add in Tracking List.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
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
              </CardContent>
              <CardFooter className="flex justify-between">
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
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  )
}
