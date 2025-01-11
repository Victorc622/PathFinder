import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const validateInputs = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";
    else if (email.length > 50)
      newErrors.email = "Email must not exceed 50 characters.";

    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    else if (password.length > 50)
      newErrors.password = "Password must not exceed 50 characters.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );
    setIsLoading(false);

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page-container">
      <h1>Log In</h1>
      {errors.general && <p className="error-general">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength="50"
            required
          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength="50"
            required
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

export default LoginFormPage;