import type { ReactNode } from "react";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthProvider";
import Loading from "../Components/Loading";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    return <Loading />;
  }

  const { user, loading } = auth;

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={location.pathname} />;
  }

  return children;
};

export default PrivateRoute;
