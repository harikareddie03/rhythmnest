import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Signup = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    day: "",
    username: "",
    year: "",
    month: "",
    password: "",
    gender: "",
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.account);

  const registerUser = async (e) => {
    e.preventDefault();

    const { email, day, username, year, month, password, gender } = userDetails;

    if (!email || !day || !username || !year || !month || !password || !gender) {
      toast.error("Please fill all the fields!");
      return;
    }

    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) {
      toast.error("Invalid month selected!");
      return;
    }

    const DOB = `${monthIndex + 1}-${day}-${year}`; 

    const userData = {
      email,
      password,
      gender,
      DOB,
      username,
    };

    try {
      const res = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (data.success) {
        setUserDetails({
          email: "",
          day: "",
          username: "",
          year: "",
          month: "",
          password: "",
          gender: "",
        });
        toast.success(data.message);
        navigate("/");
        localStorage.setItem("token", JSON.stringify(data.token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const onChange = (e) => {
    const { name, value, type, id } = e.target;

    if (type === "radio") {
      setUserDetails((prev) => ({ ...prev, gender: id }));
    } else {
      setUserDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="py-8 bg-white">
      <header className="flex justify-center items-center py-4 px-4 bg-white">
        <center>
          <div className="flex items-center">
            <Link to="/">
              <img
                src="src/assets/rythmnest1.jpeg"
                className="w-20 h-20 mr-4"
                alt="Logo"
              />
            </Link>
            <h1 className="text-3xl font-bold items-center text-gray-800">RhythmNest</h1>
          </div>
        </center>
      </header>
      <div className="text-black">
        <div className="py-10 text-center w-1/2 mx-auto">
          <h2 className="text-3xl tracking-tighter my-4 font-semibold">
            Join today for free access to endless music tracks.
          </h2>
          <span className="or__">or</span>
          <p className="my-4 font-bold">Sign up with your email address</p>
          <form onSubmit={registerUser} className="text-center mx-auto w-3/4">
            <div className="w-4/5 mx-auto text-left py-4">
              <label htmlFor="email" className="font-semibold mb-2 text-sm inline-block">
                What&apos;s your email?
              </label>
              <input
                autoComplete="off"
                type="email"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={onChange}
                placeholder="Enter your email"
                className="block w-full rounded-[4px] shadow-sm p-3"
              />
            </div>
            <div className="w-4/5 mx-auto text-left py-4">
              <label htmlFor="password" className="font-semibold mb-2 text-sm inline-block">
                Create a password
              </label>
              <input
                autoComplete="off"
                type="password"
                id="password"
                name="password"
                value={userDetails.password}
                onChange={onChange}
                placeholder="Create a password"
                className="block w-full rounded-[4px] shadow-sm p-3"
              />
            </div>

            <div className="w-4/5 mx-auto text-left py-4">
              <label htmlFor="username" className="font-semibold mb-2 text-sm inline-block">
                What should we call you?
              </label>
              <input
                autoComplete="off"
                type="text"
                id="username"
                name="username"
                value={userDetails.username}
                onChange={onChange}
                placeholder="Enter your username"
                className="block w-full rounded-[4px] shadow-sm p-3"
              />
              <small>It will appear on your profile</small>
            </div>

            <div className="w-4/5 mx-auto text-left py-4">
              <label htmlFor="dob" className="font-semibold mb-2 text-sm inline-block">
                What&apos;s your date of birth?
              </label>
              <div className="flex gap-8">
                <input
                  type="text"
                  name="day"
                  value={userDetails.day}
                  onChange={onChange}
                  placeholder="DD"
                  className="w-1/4 p-3"
                />
                <select
                  name="month"
                  value={userDetails.month}
                  onChange={onChange}
                  className="w-2/4 p-3"
                >
                  <option value="">Month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="year"
                  value={userDetails.year}
                  onChange={onChange}
                  placeholder="YYYY"
                  className="w-1/4 p-3"
                />
              </div>
            </div>

            <div className="flex gap-4 my-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  id="M"
                  checked={userDetails.gender === "M"}
                  onChange={onChange}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  id="F"
                  checked={userDetails.gender === "F"}
                  onChange={onChange}
                />{" "}
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  id="O"
                  checked={userDetails.gender === "O"}
                  onChange={onChange}
                />{" "}
                Other
              </label>
            </div>

            <div className="w-4/5 mx-auto text-left py-4">
              <label htmlFor="terms" className="inline-flex items-center">
                <input type="checkbox" id="terms" name="terms" className="form-checkbox" />
                <span className="ml-2">I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>

            <div className="w-4/5 mx-auto text-left py-4">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="my-4">
            Already have an account? <Link to="/login" className="text-blue-500">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
