import { useEffect, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPrompt = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    console.log("LoginPrompt: Checking auth status...");

    if (!loading && user) {
        const prevPage = sessionStorage.getItem("lastVisitedPage") || "/";
        console.log("🔄 Redirecting to:", prevPage);
        navigate(prevPage, { replace: true });
            }

    if (!loading) setChecked(true);
  }, [user, loading, navigate]);

  if (loading) return <p>Loading...</p>; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Welcome!</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          You need to log in or sign up to continue.
        </p>
        <div className="flex flex-col gap-4">
          <Link to="/login">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
