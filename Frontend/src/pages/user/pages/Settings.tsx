import { Clock, List, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingsPage() {
  const { setTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-background md:w-1/2">
      <div className="flex-1">
        {/* Settings Content */}
        <div className="max-w-3xl mx-auto py-16 px-4">
          <h1 className="text-2xl font-bold mb-12 text-center">Settings</h1>

          <div className="space-y-10">
            {/* Theme Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
                  <Moon
                    size={24}
                    className="text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Change theme</h3>
                  <p className="text-muted-foreground text-sm">
                    Switch it up! Change your app theme for a fresh look.
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Language Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
                  <Clock
                    size={24}
                    className="text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Change Language</h3>
                  <p className="text-muted-foreground text-sm">
                    All details will reset except username
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-red-500 hover:bg-red-600 text-white border-0"
              >
                Choose
              </Button>
            </div>

            {/* Password Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
                  <List
                    size={24}
                    className="text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Change Password</h3>
                  <p className="text-muted-foreground text-sm">
                    All details will reset except username
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-red-500 hover:bg-red-600 text-white border-0"
              >
                Change
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
