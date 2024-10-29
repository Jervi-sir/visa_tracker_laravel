import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger, } from "@/Components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage, } from "@/Components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/Components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Separator } from "@/Components/ui/separator"
import { BadgeCheck, Bell, ChevronRight, ChevronsUpDown, Command, CreditCard, Folder, LogOut, MoreHorizontal, Share, Sparkles, SquareTerminal, Trash2, User, User2, } from "lucide-react"
import { BookOpen, Bot, Frame, LifeBuoy, Map, PieChart, Send, Settings2, } from "lucide-react"
import { usePage } from "@inertiajs/react"
import { useEffect } from "react"
import { Toaster } from "@/Components/ui/toaster"
import { ToastProvider } from "@/Components/ui/toast"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "List Websites",
      url: route('websites.list'),
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Add Website",
      url: route('websites.createTracker'),
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Subscription",
      url: "#",
      icon: LifeBuoy,
    },
  ],

}

export default function ClientLayout({ children, title = '' }) {


  return (
    <SidebarProvider>
      <ToastProvider>
        <Content children={children} title={title} />
      </ToastProvider>
    </SidebarProvider>
  );
}

const Content = ({ children, title = '' }) => {
  const { url } = usePage();
  const { auth } = usePage().props;

  const isTabMenuActive = (route) => {
    return route.includes(url);
  }
  useEffect(() => {
  }, [])

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Visa Tracker</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Trackers</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item: any) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isTabMenuActive(item.url)}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={auth.user.email}
                        alt={auth.user.name}
                      />
                      <AvatarFallback className="rounded-lg"><User size={18} /></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {auth.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {auth.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={auth.user.email}
                          alt={auth.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          <User size={18} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {auth.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {auth.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Subscription
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    { title }
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
        <Toaster />
      </SidebarInset>
    </>

  )
}