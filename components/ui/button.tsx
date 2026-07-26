import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-primary/88",
        outline: "border-border bg-card text-foreground hover:border-foreground/45 hover:bg-secondary",
        glass: "border-white/30 bg-black/36 text-white backdrop-blur-md hover:bg-black/50",
        secondary: "border-secondary bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "border-transparent bg-transparent hover:bg-secondary",
        destructive: "border-destructive bg-destructive text-white hover:bg-destructive/90",
        link: "border-transparent bg-transparent p-0 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4",
        xs: "h-8 px-2.5 text-xs",
        sm: "h-9 px-3 text-xs",
        lg: "h-13 px-5 text-sm",
        icon: "size-11",
        "icon-xs": "size-8",
        "icon-sm": "size-10",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({ className, variant = "default", size = "default", ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
