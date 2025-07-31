import { useState } from "react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  setDoc,
  getDocs
} from "firebase/firestore";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const handleSignupComplete = async ({ name, age, gender, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

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

  const handleNext = async (e) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      if (!email) {
        return setError("Please enter a valid email address");
      }
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setUserExists(true); // User exists in Firestore
          setStep(2);
        } else {
          setUserExists(false); // New user
          setStep(3);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    } else if (step === 2) {
      if (!password) {
        return setError("Please enter a password");
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (err) {
        setError(`Error: ${err.message}`);
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
    } else {
      setStep(step - 1);
      setError("");
    }
    setError("");
  };

  return (
    <div className="auth-form-wrapper">
      <form
        className={`${step == 3 && "signup-details"} auth-form`}
        onSubmit={handleNext}
      >
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

        {step === 3 && !userExists && (
          <Signup
            onSignupComplete={handleSignupComplete}
            backtoLogin={handleBack}
          />
        )}

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
