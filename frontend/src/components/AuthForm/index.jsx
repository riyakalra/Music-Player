import { useState } from "react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import {
  getAuth,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Signup from "./Signup";
import "./index.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(null);
  const auth = getAuth();

  const handleNext = async (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!email) {
        return setError("Please enter a valid email address");
      }

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setUserExists(true);
          setStep(2);
        } else {
          setUserExists(false);
          setStep(3);
        }
      } catch (err) {
        setError("Invalid email format or network error.");
      }
    } else if (step === 2) {
      if (!password) {
        return setError("Please enter a password");
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      } catch (err) {
        setError("Invalid password or user not found.");
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setPassword("");
      setUserExists(null);
    } else if (step === 3) {
      setStep(1);
      setUserExists(null);
    }
    setError("");
  };

  return (
    <div className="auth-form-wrapper">
      <form className={`${step == 3 && "signup-details"} auth-form`} onSubmit={handleNext}>
        {step === 1 && (
          <input
            type="email"
            placeholder="Enter your email to get started"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
        )}

        {step === 2 && userExists && (
          <div className="auth-input-wrapper">
            <ArrowLeftCircleIcon className="back-button" onClick={handleBack} />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>
        )}

        {step === 3 && !userExists && <Signup email={email} />}

        {error && (
          <div className="auth-error">
            <span>{error}</span>
          </div>
        )}

        {step !== 3 && (
          <button type="submit" className="auth-button">
            Next
          </button>
        )}
      </form>
    </div>
  );
}
