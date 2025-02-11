import { useTheme } from "next-themes";
import { Loader2, Moon, Sun } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useEffect, useState } from "react";
export function ToggleThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          {mounted ? (
            <SidebarMenuButton
              onClick={() =>
                setTheme(systemTheme === "dark" ? "light" : "dark")
              }
              tooltip={
                systemTheme === "dark"
                  ? "Turn on Light Mode"
                  : "Turn on Dark Mode"
              }
            >
              {systemTheme === "dark" ? <Sun /> : <Moon />}
              <span>
                Toggle {systemTheme === "dark" ? "Light" : "Dark"} Mode
              </span>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
