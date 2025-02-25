import { Routes, Route } from 'react-router';
import Login from '../Login/Login';
import { useLogin } from '../Login/useLogin';

function PublicRoutes () {
    const { credencialUser, setCredencialUser, handleLoginSubmit } = useLogin()
    
    return (
        <Routes>
            <Route 
                path="/login" 
                element={
                    <Login 
                        credencialUser={credencialUser}
                        setCredencialUser={setCredencialUser}
                        handleLoginSubmit={handleLoginSubmit}
                    />
                } 
            />
        </Routes>
    );
}

export default PublicRoutes;