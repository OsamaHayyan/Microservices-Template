import {InputHTMLAttributes} from 'react';
import {Input} from "@/components/UI/Input.tsx";
import ErrorMessage from "@/components/UI/ErrorMessage.tsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    errorMessage?:string;
}
const InputForm = ({errorMessage,...props}: InputProps) => {
    return (
        <div className="space-y-2">
            <Input
                {...props}
            />
            <ErrorMessage message={errorMessage} />
        </div>
    );
};

export default InputForm;