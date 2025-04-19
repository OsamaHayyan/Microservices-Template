import { InputHTMLAttributes } from 'react';
import cn from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
}

const Input = ({ className, type = 'text', ...props }: InputProps) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-2xl bg-slate-100 px-3 py-2 md:text-sm ring ring-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

export { Input }
