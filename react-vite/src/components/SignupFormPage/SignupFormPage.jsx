import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const validateInputs = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";
    else if (email.trim().length > 50)
      newErrors.email = "Email must not exceed 50 characters.";

    if (!username.trim()) newErrors.username = "Username is required.";
    else if (username.trim().length < 3)
      newErrors.username = "Username must be at least 3 characters.";
    else if (username.trim().length > 50)
      newErrors.username = "Username must not exceed 50 characters.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    else if (password.length > 50)
      newErrors.password = "Password must not exceed 50 characters.";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords must match.";

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
      thunkSignup({
        email,
        username,
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
    <div className="signup-page-container">
      <h1>Sign Up</h1>
      {errors.general && <p className="error-general">{errors.general}</p>}
      <form onSubmit={handleSubmit} aria-labelledby="signup-header">
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

        <label htmlFor="username">
          Username
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength="50"
            required
          />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}

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

        <label htmlFor="confirmPassword">
          Confirm Password
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignupFormPage;