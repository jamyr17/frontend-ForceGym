import { ReactNode } from "react";

interface ErrorFormProps {
    children?: ReactNode;
}

function ErrorForm({ children }: ErrorFormProps) {
    return ( 
        <p className="text-red-600 text-sm">
            {children}
        </p>
    );
}

export default ErrorForm;