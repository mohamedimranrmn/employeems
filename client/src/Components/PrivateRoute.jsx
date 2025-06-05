import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("valid");
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
