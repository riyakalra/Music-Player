import { useState } from "react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import "./index.css";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && !name) {
      setError("Please enter your name");
      return;
    }
    if (step === 2 && (!age || isNaN(age))) {
      setError("Please enter a valid age");
      return;
    }
    if (step === 3 && !gender) {
      setError("Please select a gender");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  return (
    <form className="signup-form">
      <div className="auth-input-wrapper">
        <ArrowLeftCircleIcon className="back-button" onClick={handleBack} />
        <h2>Enter your details to complete setup</h2>
      </div>

      {step === 1 && (
          <input
            type="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
          />
      )}

      {step === 2 && (
         <input
         type="age"
         placeholder="Enter your age"
         value={age}
         onChange={(e) => setAge(e.target.value)}
         className="auth-input"
       />
      )}

      {step === 3 && (
        <>
          <select className="auth-input" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="preferNot">Prefer not to say</option>
          </select>
        </>
      )}

      {error && <div className="auth-error">{error}</div>}

      <div className="form-buttons">
        {step < 3 ? (
           <button type="submit" className="auth-button" onClick={handleNext}>
           Next
         </button>
        ) : (
          <button type="button" className="auth-button" onClick={() => alert("Signup complete!")}>
            Submit
          </button>
        )}
      </div>
    </form>
  );
}
