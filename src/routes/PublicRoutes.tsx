import { Routes, Route } from 'react-router';
import Login from '../Login/Login';
import { useLogin } from '../Login/useLogin';
import ForgotPasswordForm from '../Login/ForgotPasswordForm';
import ChangePasswordForm from '../Login/ChangePasswordForm';

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
            <Route 
                path="/forgot-password" 
                element={
                    <ForgotPasswordForm/>
                } 
            />
            <Route 
                path="/reset-password" 
                element={
                    <ChangePasswordForm />
                } 
            />
        </Routes>
    );
}

export default PublicRoutes;