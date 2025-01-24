import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <Toaster richColors position="top-right" />
      <AppSidebar>{children}</AppSidebar>
    </TRPCReactProvider>
  );
}
