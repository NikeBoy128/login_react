import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  return token ? children : <Navigate to="/signin" replace state={{ from: location }} />;
};

export default PrivateRoute;