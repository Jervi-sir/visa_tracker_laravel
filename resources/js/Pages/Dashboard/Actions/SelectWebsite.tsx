

import { Button } from "@/Components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
 
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/Components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/Components/ui/popover"


const SelectWebsiteFormSchema = z.object({
  websiteId: z.number().int().min(1, {
    message: "Please select a valid website.",
  }),
})


export const SelectWebsite = ({ onCreated = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { allWebsites } = usePage().props;
  const form = useForm({
    resolver: zodResolver(SelectWebsiteFormSchema),
    defaultValues: {
      websiteId: null,
    },
  });

  const { setValue, handleSubmit } = form;

  function onSubmit(data: z.infer<typeof SelectWebsiteFormSchema>) {
    setIsSubmitting(true)

    router.post(route('websites.track'), data, {
      preserveState: false, // Add this line
      onSuccess: () => {
        toast({
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Website added Successfully</code>
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
                <ComboboxDemo onSelect={(websiteId) => setValue("websiteId", websiteId)} />
              </div>
              <DialogFooter className="flex justify-between">
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

function ComboboxDemo({ onSelect }) {
  const [open, setOpen] = useState(false)
  const { allWebsites } = usePage().props;
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    console.log('allwebsites: ', allWebsites);
  }, [allWebsites])

  const handleSelect = (id) => {
    const websiteId = parseInt(id, 10);
    setSelectedId(websiteId);
    setOpen(false);
    onSelect(websiteId); // Pass selected websiteId as an integer
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedId
            ? (allWebsites as any).find((website) => website.id === selectedId)?.name
            : "Select website..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search Website..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Website found.</CommandEmpty>
            <CommandGroup>
              {(allWebsites as any).map((website) => (
                <CommandItem
                  key={website.id}
                  value={website.id}
                  onSelect={() => handleSelect(website.id)}
                >
                  {website.name}
                  <CheckIcon
                    className={cn("ml-auto h-4 w-4", selectedId === website.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
