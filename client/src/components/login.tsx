import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDet } from "../redux/slice/userSlice"; // Import Redux action

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      setError("");
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

      localStorage.setItem("token", data.token);

      dispatch(
        setUserDet({
          _id: data.user._id,
          email: data.user.email,
          name: data.user.name,
        })
      );

      setIsLoggedIn(true);
      navigate("/", { state: { from: "/login" } });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="bg-gray-900 p-8 rounded-3xl shadow-lg w-full max-w-md">
        {isLoggedIn ? (
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
            <button
              onClick={handleLogout}
              className="w-full p-2 bg-red-600 rounded hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-white mb-6">
              Login
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
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
              <div>
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

            <div className="flex justify-center items-center my-4">
              <hr className="w-1/4 border-gray-700" />
              <p className="mx-2 text-gray-400">or</p>
              <hr className="w-1/4 border-gray-700" />
            </div>

            <p className="text-center text-gray-300">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
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
