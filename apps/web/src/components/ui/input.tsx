import * as React from "react"

import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full px-3 py-2 text-sm text-white placeholder:text-white outline-none  disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)

const GenerateInput = React.forwardRef<
    HTMLInputElement,
    InputProps & {
        isLoading: boolean
    }
>(({ className, isLoading, ...props }, ref) => {
    return (
        <div className="relative w-full h-full">
            <input
                className={cn(
                    "flex h-full w-full  bg-background px-3 py-2 pr-10 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none  disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                ref={ref}
                {...props}
            />
            {isLoading ? (
                <>Loading</>
            ) : (
                <></>
            )}
        </div>
    )
})

Input.displayName = "Input"
GenerateInput.displayName = "GenerateInput"

export { Input,  GenerateInput }