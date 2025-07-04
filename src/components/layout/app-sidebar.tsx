"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { Home, Search, Bell, LifeBuoy, LogOut } from "lucide-react";
import { Separator } from "../ui/separator";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-sidebar-primary" />
          <span className="font-headline text-lg font-semibold text-sidebar-foreground">AFR EU Funds</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-3">
        <Separator />
        <div className="flex items-center gap-3 px-2">
            <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
                <span className="font-semibold text-sidebar-foreground">Jane Doe</span>
                <span className="text-muted-foreground">Partnerships Officer</span>
            </div>
        </div>
         <SidebarMenuButton asChild>
            <Link href="/">
                <LogOut />
                <span>Logout</span>
            </Link>
         </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
