import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please enter both email and password.");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Incorrect credentials.");
      } else {
        setError("Failed to login. Please check your login credentials or signup if you don't have an account.");
      }
    }
  };

  const handleSignupComplete = async ({ email, name, age, gender, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        name,
        age,
        gender,
        email: user.email,
        createdAt: new Date(),
      });

      navigate("/");
    } catch (err) {
      setError(`Signup error: ${err.message}`);
    }
  };

  return (
    <div className="auth-form-wrapper">
      {showSignup ? (
        <Signup
          onSignupComplete={handleSignupComplete}
          backtoLogin={() => setShowSignup(false)}
        />
      ) : (
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button">
            Login
          </button>

          <p className="auth-switch">
            Don’t have an account?{" "}
            <button
              type="button"
              className="auth-signup-btn"
              onClick={() => setShowSignup(true)}
            >
              Sign up
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
