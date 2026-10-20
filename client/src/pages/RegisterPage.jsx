
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords don't match. Try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create your account.");
      }

      // Store the session for this prototype.
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
                A space that's yours
              </p>
              <h1 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tight text-[#352E29] sm:text-4xl">
                Start with where you are.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-[#756C60]">
                Some days are easy to explain. Some aren't. MyTrueDay gives
                you a place to check in, write things down, and make sense
                of your days at your own pace.
              </p>
            </div>
            <p className="mt-12 border-t border-[#D3CCBA] pt-5 text-sm leading-6 text-[#756C60]">
              No need to have everything figured out before you begin.
            </p>
          </section>

          <section className="p-7 sm:p-10 md:p-12">
            <p className="text-sm font-medium text-[#B87559]">
              Create an account
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#352E29]">
              Make yourself at home.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#756C60]">
              A few details and you're ready to get started.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="register-name" className="text-sm font-medium text-[#51473E]">
                  Your name
                </label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={80}
                  required
                />
              </div>

              <div>
                <label htmlFor="register-email" className="text-sm font-medium text-[#51473E]">
                  Email address
                </label>
                <input
                  id="register-email"
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
                <label htmlFor="register-password" className="text-sm font-medium text-[#51473E]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-16`}
                    minLength={8}
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

              <div>
                <label htmlFor="register-confirm-password" className="text-sm font-medium text-[#51473E]">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`${inputClass} pr-16`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#68704B] hover:underline"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
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
                {loading ? "Creating your account..." : "Create your space"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#756C60]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#68704B] hover:underline">
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-[#8A8074]">
              Your check-ins and journal entries can stay together in one place.
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

export default RegisterPage;
