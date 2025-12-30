import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { useNavigate, Link, Navigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useState ,useRef, useEffect} from "react";
import { GoogleLogin } from "@react-oauth/google";



const Login = ({ isModal = false, onClose }) => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { token } = useAuth()
  const [errorMsg, setErrorMsg] = useState("");
  const loginBtnRef = useRef(null);
  const [googleWidth, setGoogleWidth] = useState(null); 

  

  useEffect(() => {
  const updateWidth = () => {
    if (loginBtnRef.current) {
      setGoogleWidth(loginBtnRef.current.offsetWidth);
    }
  };

  updateWidth();
  window.addEventListener("resize", updateWidth);

  return () => window.removeEventListener("resize", updateWidth);
}, []);

   if (!isModal && token) return <Navigate to="/" replace />;

  const onSubmit = async (data) => {
    setErrorMsg(""); // reset error

    try {
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.user);

      if (isModal && onClose) {
        onClose();
      } else {
        navigate("/", { replace: true }); // prevents going back to login
      }

    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials";

      // 🎨 Nicely display proper errors:
      if (message.toLowerCase().includes("email")) {
        setErrorMsg("⚠️ No account found with this email");
      } else if (message.toLowerCase().includes("credentials")) {
        setErrorMsg("⚠️ Incorrect password");
      } else {
        setErrorMsg("⚠️ Login failed. Please try again.");
      }
    }
  };

  const Form = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm  px-6 py-6 sm:py-8 rounded-xl space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {/* 🔥 SHOW ERROR */}
      {errorMsg && (
        <p className="text-red-600 bg-red-100 p-2 text-center rounded text-sm">
          {errorMsg}
        </p>
      )}

      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

<div className="w-full flex justify-center">
  <GoogleLogin
    onSuccess={async (res) => {
      const result = await api.post("/auth/google", {
        credential: res.credential,
      });
      login(result.data.token, result.data.user);
      navigate("/");
    }}
    onError={() => console.log("Google login failed")}
    ux_mode="popup"
    theme="outline"
    shape="rectangular"
    size="large"
    text="continue_with"
    width={googleWidth ? String(googleWidth) : undefined} // 👈 DYNAMIC WIDTH
  />
</div>

      <button 
      ref={loginBtnRef}
      className="w-full bg-black text-white py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-gray-800">
        Login
      </button>

      <p className="text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="text-black font-medium hover:underline">
          Signup
        </Link>
      </p>
    </form>
  );

  // Modal / Full page logic
  if (isModal) return <Modal onClose={onClose}>{Form}</Modal>;

 return (
  <div className="
    min-h-[80dvh] px-4  flex items-center justify-center w-full">
    <div className="w-full max-w-sm">{Form}</div>
  </div>
);

};

export default Login;