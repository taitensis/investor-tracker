// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { session } = useAuth();

    return session ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
