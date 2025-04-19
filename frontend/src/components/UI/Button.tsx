import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium cursor-pointer transition-colors", {
    variants: {
        intent: {
            primary: ["bg","bg-green-800", "text-white", "hover:bg-green-800/90", "disabled:bg-green-800/50", "disabled:cursor-not-allowed"],
            outline: ["border", "border-slate-200", "bg-white", "text-gray-800", "hover:bg-slate-200", "hover:border-slate-100/90"],
        },
        size: {
            lg: ["text-lg", "py-3", "px-6"],
            sm: ["text-sm", "py-1", "px-2"],
            md: ["text-base", "py-2", "px-4"],
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "md",
    },
});



export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button =
    ({className, intent, size, children, ...props}: ButtonProps) => {
        return (
            <button className={buttonVariants({intent, size, className})} {...props}>{children}</button>
        )
    }

export default Button;

