import {HTMLAttributes} from "react";
import cn from "clsx";

interface IProps extends HTMLAttributes<HTMLDivElement> {
}

const Spinner = ({className, ...props}:IProps) => {
    return (
        <div className={cn("animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2", className)} {...props}></div>
    );
};

export default Spinner;