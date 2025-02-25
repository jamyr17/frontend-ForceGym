import { PropsWithChildren } from "react";

function ErrorForm({ children } : PropsWithChildren) {
    return ( 
        <p className="text-red-600 text-sm">
            {children}
        </p>
    );
}

export default ErrorForm;