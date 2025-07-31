import AuthForm from "../../components/AuthForm";
import "./index.css";

export default function AuthPage() {
  return (
    <div className="auth-page">
      
        <h1 className="auth-title">
          Feel the Beat.
        </h1>
        <p className="auth-description">
          Welcome to <span className="auth-app-name">MelodyHub</span> - your
          personal music universe. Discover tracks, vibe with playlists, and
          never miss a beat again.
        </p>

      <AuthForm />
    </div>
  );
}
