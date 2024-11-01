import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger, } from "@/Components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage, } from "@/Components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/Components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Separator } from "@/Components/ui/separator"
import { BadgeCheck, Bell, ChevronRight, ChevronsUpDown, Command, CreditCard, DoorClosed, Folder, Loader, Loader2, LogOut, MoreHorizontal, Settings, Share, Sparkles, SquareTerminal, Trash2, User, User2, } from "lucide-react"
import { BookOpen, Bot, Frame, LifeBuoy, Map, PieChart, Send, Settings2, } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
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
      url: route('admin.listWebsites'),
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Suggest Website",
      url: route('admin.suggestWebsite'),
      icon: Settings,
      isActive: true,
    },
    {
      title: "Go to main site",
      url: route('websites.list'),
      icon: DoorClosed,
    },
  ],
}

export default function AdminLayout({ children, title = '' }) {


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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Visa Tracker</span>
                    <span className="truncate text-xs">Admin</span>
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
                        src={auth.user.photo_url}
                        alt={auth.user.name}
                      />
                      <AvatarFallback className="rounded-lg"><User size={18} /></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {auth.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {auth.user.email ? auth.user.email : auth.user.username}
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
                          src={auth.user.photo_url}
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
                          {auth.user.email ? auth.user.email : auth.user.username}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogoutButton />
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

const LogoutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  return (
    <>
      
      <Link
        href={route('logout')}
        method="post"
        as="button"
        onClick={() => setIsLoggingOut(true)}
        className="flex items-center gap-2"
      >
        {
          isLoggingOut
          ?
          <Loader2 size={15} className="animate-spin" />
          :
          <LogOut size={15} />
        }
        Log Out
      </Link>
    </>
  )
}