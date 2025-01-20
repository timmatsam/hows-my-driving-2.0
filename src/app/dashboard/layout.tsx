import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { AppSidebar } from "@/components/app-sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <AppSidebar>{children}</AppSidebar>
    </TRPCReactProvider>
  );
}
