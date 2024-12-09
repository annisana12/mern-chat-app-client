import { toast } from "sonner";

export const errorHandler = (error, toastDuration) => {
    if (error.response) {
        const { message, data } = error.response.data;
        let description = data;

        if (data && data.errors) {
            description = data.errors.map((el, index) => (<div key={index}>{el.message}</div>))
        }

        toast.error(message, {
            description,
            duration: toastDuration
        });
    } else {
        toast.error("Internal Server Error");
    }
}