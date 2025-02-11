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
      const { setTheme, theme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          {mounted ? (
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              tooltip={
                theme === "dark" ? "Turn on Light Mode" : "Turn on Dark Mode"
              }
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
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
