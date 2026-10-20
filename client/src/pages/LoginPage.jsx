
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in.");
      }

      localStorage.setItem("mytrueday_token", data.token);
      localStorage.setItem("mytrueday_user", JSON.stringify(data.user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Cannot reach the server. Make sure the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#DED5C9] bg-[#FFFEFC] px-4 py-3 text-sm text-[#352E29] outline-none transition placeholder:text-[#A39A8E] focus:border-[#68704B] focus:ring-2 focus:ring-[#68704B]/15";

  return (
    <main className="min-h-screen bg-[#F3EEE5] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/" aria-label="MyTrueDay home" className="inline-flex">
          <img
            src="/mytrueday-logo.png"
            alt="MyTrueDay"
            className="h-auto w-40 object-contain sm:w-48"
          />
        </Link>

        <div className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-2xl border border-[#E3DACE] bg-[#FBF9F5] shadow-sm md:mt-14 md:grid-cols-2">
          <section className="flex flex-col justify-between bg-[#EAE6D8] p-7 sm:p-10 md:p-12">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#68704B]">
                Good to have you back
              </p>
              <h1 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tight text-[#352E29] sm:text-4xl">
                Come back to yourself.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-[#756C60]">
                Pick up where you left off, write down what's on your mind,
                or take a quiet moment to check in with yourself.
              </p>
            </div>
            <p className="mt-12 border-t border-[#D3CCBA] pt-5 text-sm leading-6 text-[#756C60]">
              Your day doesn't have to be perfect for you to show up for yourself.
            </p>
          </section>

          <section className="p-7 sm:p-10 md:p-12">
            <p className="text-sm font-medium text-[#B87559]">
              Welcome back
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#352E29]">
              Sign in to your space.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#756C60]">
              Let's pick up from where you are today.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="login-email" className="text-sm font-medium text-[#51473E]">
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="login-password" className="text-sm font-medium text-[#51473E]">
                    Password
                  </label>
                  <span className="text-xs text-[#8A8074]">
                    Forgot password? Coming soon
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-16`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#68704B] hover:underline"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm leading-6 text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#68704B] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#555D3D] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#68704B]"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#756C60]">
              New to MyTrueDay?{" "}
              <Link to="/register" className="font-semibold text-[#68704B] hover:underline">
                Create an account
              </Link>
            </p>
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-[#8A8074]">
          <Link to="/" className="hover:text-[#68704B] hover:underline">
            Back to MyTrueDay
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
