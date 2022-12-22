import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import React from "react";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { roles } = useAuth();

  const content = roles.some((role) => allowedRoles.includes(role)) ? ( /* Comprobamos si el rol del usuario logeado esta
    incluido dentro de allowedRoles, de ser asi entonces dejamos que entre a la ruta privada, sino lo mandamos al login */ 
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
};

export default RequireAuth;
