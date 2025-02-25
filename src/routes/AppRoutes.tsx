import { Route, Routes } from "react-router";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

function AppRoutes () {

    return (
        <Routes>
            <Route 
                path="/*" 
                element={ <PublicRoutes /> } 
            />

            <Route 
                path="gestion/*" 
                element={ <PrivateRoutes /> }
            />
            
        </Routes>
    );
}

export default AppRoutes;