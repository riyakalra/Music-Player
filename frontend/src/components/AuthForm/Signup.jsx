import { useState } from "react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import "./index.css";

export default function Signup({ onSignupComplete, backtoLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!email) return setError("Please enter your email");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return setError("Please enter a valid email");
    }

    if (step === 2 && !name) {
      return setError("Please enter your name");
    }

    if (step === 3 && (!age || isNaN(age))) {
      return setError("Please enter a valid age");
    }

    if (step === 4 && !gender) {
      return setError("Please select a gender");
    }

    if (step === 5 && !password) {
      return setError("Please enter a password.");
    }

    if (step === 6) {
      if (!confirmPassword) return setError("Please confirm your password.");
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }
      onSignupComplete?.({ email, name, age, gender, password });
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      backtoLogin();
      return;
    }
    setError("");
    setStep(step - 1);
  };

  return (
    <div className="auth-form">
      <div className="auth-input-wrapper">
        <ArrowLeftCircleIcon className="back-button" onClick={handleBack} />
        <h2 className="signup-description">Enter your details to complete setup</h2>
      </div>

      {step === 1 && (
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
      )}

      {step === 2 && (
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
        />
      )}

      {step === 3 && (
        <input
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="auth-input"
        />
      )}

      {step === 4 && (
        <select
          className="auth-input"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
          <option value="preferNot">Prefer not to say</option>
        </select>
      )}

      {step === 5 && (
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
      )}

      {step === 6 && (
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
        />
      )}

      {error && <div className="auth-error">{error}</div>}

      <button type="submit" className="auth-button" onClick={handleNext}>
        {step === 6 ? "Sign Up" : "Next"}
      </button>
    </div>
  );
}
