import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDet } from "../redux/slice/userSlice"; // Import Redux action

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook to programmatically navigate
  const dispatch = useDispatch(); // To dispatch actions
  const baseurl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { email, password };

    try {
      setError(""); // Clear previous errors
      const response = await fetch(`${baseurl}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Save the token to localStorage
      localStorage.setItem("token", data.token);

      // Dispatch user details to Redux
      dispatch(
        setUserDet({
          _id: data.user._id,
          email: data.user.email,
          name: data.user.name,
        })
      );

      setIsLoggedIn(true); // Update login state

      // Redirect to the home page
      navigate("/", { state: { from: "/login" } });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Display the error message
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-800 w-full p-4">
      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 h-[70%] rounded-bl-3xl justify-center items-center">
        {/* <img src="" alt="Login Illustration" className="w-3/4 h-auto" /> */}
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-gray-900 p-6 md:p-8 rounded-lg flex flex-col justify-center shadow-lg w-full md:w-1/2 lg:w-[35%] h-auto md:h-[70%] rounded-tr-3xl">
        {isLoggedIn ? (
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Welcome Back!</h2>
            <button
              onClick={handleLogout}
              className="w-full p-2 bg-red-600 rounded hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-6">
              Login
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 rounded hover:bg-blue-500 transition"
              >
                Login
              </button>
            </form>

            <div className="flex justify-center items-center mt-4">
              <hr className="bg-gray-800 w-1/3" />
              <p className="mx-2 text-white">or</p>
              <hr className="bg-gray-800 w-1/3" />
            </div>

            <p className="text-center text-gray-300 mt-4">
              Don't have an account?
              <Link to="/signup" className="text-blue-500 hover:underline ml-1">
                Sign Up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
