import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth();
    // const user = sessionStorage.getItem("user")

    // console.log("ProtectedRoute: isLoggedIn =", isLoggedIn);
    // console.log(user);

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
