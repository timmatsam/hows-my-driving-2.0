"use client";

import * as React from "react";
import { LightbulbIcon, ScrollTextIcon, SearchIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Pages } from "@/types/pages";

// This is sample data.
const navMain = [
  {
    title: "All Violations",
    url: Pages.DASHBOARD,
    icon: ScrollTextIcon,
  },
  {
    title: "Search by Plate",
    url: Pages.SEARCH,
    icon: SearchIcon,
  },
  {
    title: "Request a Feature",
    url: Pages.REQUEST_FEATURE,
    icon: LightbulbIcon,
  },
  // {
  //   title: "Charts",
  //   url: Pages.CHARTS,
  //   icon: BarChartIcon,
  // },
  // {
  //   title: "About",
  //   url: Pages.ABOUT,
  //   icon: InfoIcon,
  // },
];

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <NavMain items={navMain} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
