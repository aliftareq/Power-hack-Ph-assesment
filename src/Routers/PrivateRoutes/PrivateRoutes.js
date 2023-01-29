import React, { useContext } from 'react';
import { Navigate, useLocation, } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthProvider';
import LoadingSpinner from '../../Pages/Shared/LoadingSpinner';

const PrivateRoutes = ({ children }) => {
    //context value
    const { user, loading } = useContext(AuthContext)
    //location
    const location = useLocation()

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>
    }
    if (user) {
        return children
    }
    return <Navigate to='/login' state={{ from: location }} replace></Navigate>
};

export default PrivateRoutes;