import {IoAlertCircleOutline} from "react-icons/io5";

interface IProps {
    message?: string;
}
const ErrorMessage = ({message}:IProps) => {
    return (
        <div className={`flex items-center text-sm text-red-500 mt-1 gap-1 ${message ? 'block' : 'hidden'}`}>
            <IoAlertCircleOutline />
            {message}
        </div>
    );
};

export default ErrorMessage;