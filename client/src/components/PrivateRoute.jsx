import { Navigate, Outlet } from "react-router-dom" 

function PrivateRoute({isLoggedIn}) {
  return isLoggedIn? <Outlet/> : <Navigate to="/" /> //“If this route has nested routes, render them here.”
}

export default PrivateRoute