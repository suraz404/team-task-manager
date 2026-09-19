import { useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type RegisterResponse = {
  message?: string;
  error?: string;
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to create your account");
      }

      setMessage(result.message ?? "Account created successfully");
      setEmail("");
      setPassword("");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-panel" aria-labelledby="register-title">
        <p className="eyebrow">Team Task Manager</p>
        <h1 id="register-title">Create your account</h1>
        <p className="intro">
          Start organizing your team&apos;s work in one place.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p className="password-hint">Use at least 8 characters.</p>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message && (
          <p className={isError ? "feedback error" : "feedback"} role="status">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
