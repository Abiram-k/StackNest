import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer cursor-pointer data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-zinc-200 focus-visible:border-red-650 focus-visible:ring-red-650/50 inline-flex h-6 w-13 shrink-0 items-center rounded-full border-2 border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:data-[state=checked]:bg-red-500 dark:data-[state=unchecked]:bg-zinc-50 dark:focus-visible:border-zinc-300 dark:focus-visible:ring-zinc-300/50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none block size-5 rounded-full ring-0 shadow-lg transition-transform data-[state=checked]:translate-x-7.5 data-[state=unchecked]:translate-x-0 dark:bg-zinc-950 "
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
