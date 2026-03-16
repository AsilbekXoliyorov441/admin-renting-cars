import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("admin");

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
