
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // Import useAuth for login
import "./login.css";
const Login = () => {
  const { login } = useAuth(); // Get login function from AuthContext
  const [userDetails, setUserDetails] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Handle form submission
  const loginUser = async (e) => {
    e.preventDefault();
    const { username, password } = userDetails;

    try {
      const res = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        login(data.user, data.token); // Store user and token
        navigate("/"); // Redirect to homepage
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle input changes
  const onChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Your existing JSX for the login form */}
      <header className="flex justify-center items-center py-4 px-4 bg-white">
        <center>
          <div className="flex items-center">
            <Link to="/">
              <img
                src="src/assets/rythmnest1.jpeg"
                className="w-13 h-16 mr-5 rounded-full"
                alt="Logo"
              />
            </Link>
            <h1 className="text-3xl font-bold items-center text-black-800">RhythmNest</h1>
          </div>
        </center>
      </header>
      <div className="bg-white py-10 w-full">
        <div className="bg-white py-10 text-center w-1/2 mx-auto">
          <h1 className="text-5xl my-12 font-semibold">Log in to RhythmNest</h1>
          <div className="border-b border-gray-400 w-3/4 my-4 mx-auto"></div>
          <form onSubmit={loginUser} className="text-center mx-auto w-1/2 ">
            <div className="w-full text-left py-4">
              <label
                htmlFor="username"
                className="font-semibold mb-2 inline-block"
              >
                Email or username
              </label>
              <input
                type="text"
                id="username"
                value={userDetails.username}
                onChange={onChange}
                name="username"
                placeholder="Email or username"
                autoComplete="off"
                className="block w-full rounded-[4px] border-0  text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-white bg-[#1a1919]"
              />
            </div>
            <div className="w-full text-left py-4 relative">
              <label
                htmlFor="password"
                className="font-semibold mb-2 inline-block"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={userDetails.password}
                onChange={onChange}
                name="password"
                placeholder="Password"
                className="block w-full rounded-[4px] border-0  text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-white bg-[#1a1919]"
              />
            </div>

            <div className="w-full text-left py-4">
              <input
                type="submit"
                value="Log in"
                placeholder="Password"
                className="block cursor-pointer w-full outline-none bg-blue-400 text-black p-3 hover:scale-105 translate-all duration-200 font-medium hover:font-semibold text-center rounded-full "
              />
            </div>
            <div className="w-full text-center py-4">
              <Link
                to="/password/forgot"
                className="text-white font-semibold underline mx-auto"
              >
                Forget Password?
              </Link>
            </div>
          </form>
          <div className="border-b border-gray-400 w-3/4 my-4 mx-auto"></div>
          <p className="pt-8">
            <span className="text-gray-300 font-semibold">
              Don&apos;t have an account?{" "}
            </span>

            <Link
              to="/signup"
              className="text-grey hover:text-green-500 font-semibold underline mx-auto"
            >
              Sign up for RhythmNest
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
