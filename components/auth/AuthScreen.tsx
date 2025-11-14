import React, { useState, useEffect } from "react";
import { User, UserRole } from "../../types";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "../icons/Icons";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<User | null>;
  onInitiateSignup: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  onVerifyOtp: (otp: string) => Promise<boolean>;
}

const WelcomePanel = () => (
  <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white text-center">
    <AcademicCapIcon className="h-24 w-24 mb-6" />
    <h1 className="text-4xl font-bold">Welcome to Purple LMS</h1>
    <p className="mt-4 text-lg text-indigo-100">
      Unlock Your Trading Potential. Learn, Grow, and Succeed in the Financial
      Markets.
    </p>
  </div>
);

const InputField = ({ id, type, label, value, onChange, icon }: any) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>

    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={label}
      required
      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
    />
  </div>
);

// 🔥 PASSWORD FIELD WITH EYE TOGGLE
const PasswordInput = ({ id, label, value, onChange }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {/* Left Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <LockClosedIcon className="h-5 w-5 text-slate-400" />
      </div>

      {/* Input */}
      <input
        id={id}
        name={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={label}
        required
        className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
      />

      {/* Right Toggle Button */}
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500"
      >
        {visible ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

const OtpInput = ({ otp, setOtp }: any) => {
  const handleChange = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setOtp(value.slice(0, 6));
  };

  return (
    <input
      type="text"
      value={otp}
      onChange={handleChange}
      maxLength={6}
      required
      className="block w-full text-center text-3xl tracking-[1em] py-3 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
    />
  );
};

export const AuthScreen = ({
  onLogin,
  onInitiateSignup,
  onVerifyOtp,
}: AuthScreenProps) => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState<"details" | "otp">("details");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState(UserRole.Student);

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let timer: any;
    if (signupStep === "otp" && countdown > 0) {
      timer = setInterval(() => setCountdown((t) => t - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [signupStep, countdown]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    const user = await onLogin(loginEmail, loginPassword);
    if (!user) setError("Invalid email or password.");
  };

  const handleSignupSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!signupName || !signupEmail || !signupPassword) {
      setError("Please fill out all fields.");
      return;
    }

    const ok = await onInitiateSignup(
      signupName,
      signupEmail,
      signupPassword,
      signupRole
    );

    if (ok) {
      setSignupStep("otp");
      setCountdown(60);
      setCanResend(false);
    } else {
      setError("Email already exists.");
    }
  };

  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter valid 6-digit OTP.");
      return;
    }

    const ok = await onVerifyOtp(otp);
    if (!ok) setError("Invalid OTP.");
  };

  const resendOtp = async () => {
    await onInitiateSignup(
      signupName,
      signupEmail,
      signupPassword,
      signupRole
    );
    setCountdown(60);
    setCanResend(false);
    setOtp("");
  };

  const switchMode = (m: any) => {
    setAuthMode(m);
    setSignupStep("details");
    setError("");
    setOtp("");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <WelcomePanel />

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {authMode === "login" ? (
            <div>
              <h2 className="text-3xl font-bold text-center text-slate-800">
                Login
              </h2>
              <p className="text-center text-slate-500 mt-2 mb-8">
                Welcome back!
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <InputField
                  id="email"
                  type="email"
                  label="Email"
                  value={loginEmail}
                  onChange={(e: any) => setLoginEmail(e.target.value)}
                  icon={<EnvelopeIcon className="h-5 w-5 text-slate-400" />}
                />

                <PasswordInput
                  id="password"
                  label="Password"
                  value={loginPassword}
                  onChange={(e: any) => setLoginPassword(e.target.value)}
                />

                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}

                <button className="w-full py-3 rounded-md text-white bg-gradient-to-r from-indigo-600 to-violet-600">
                  Login
                </button>
              </form>

              <p className="text-center mt-6 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-violet-600"
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : signupStep === "details" ? (
            <div>
              <h2 className="text-3xl font-bold text-center text-slate-800">
                Create Account
              </h2>

              <form onSubmit={handleSignupSubmit} className="space-y-6 mt-8">
                <InputField
                  id="name"
                  type="text"
                  label="Full Name"
                  value={signupName}
                  onChange={(e: any) => setSignupName(e.target.value)}
                  icon={<UserIcon className="h-5 w-5 text-slate-400" />}
                />

                <InputField
                  id="email"
                  type="email"
                  label="Email"
                  value={signupEmail}
                  onChange={(e: any) => setSignupEmail(e.target.value)}
                  icon={<EnvelopeIcon className="h-5 w-5 text-slate-400" />}
                />

                <PasswordInput
                  id="password"
                  label="Password"
                  value={signupPassword}
                  onChange={(e: any) => setSignupPassword(e.target.value)}
                />

                <div>
                  <label className="text-sm font-medium block mb-2">
                    I am a...
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-1 space-x-1">
                    {Object.values(UserRole).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setSignupRole(r)}
                        className={`w-full py-2 rounded-md text-sm ${
                          signupRole === r
                            ? "bg-white text-violet-600 shadow"
                            : "text-slate-600"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}

                <button className="w-full py-3 rounded-md text-white bg-gradient-to-r from-indigo-600 to-violet-600">
                  Continue
                </button>
              </form>

              <p className="text-center mt-6 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-violet-600"
                >
                  Login
                </button>
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-center text-slate-800">
                Verify Email
              </h2>

              <form onSubmit={handleOtpSubmit} className="space-y-6 mt-8">
                <OtpInput otp={otp} setOtp={setOtp} />

                <div className="text-center text-sm text-slate-500">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="text-violet-600"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <>Resend in {countdown}s</>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}

                <button className="w-full py-3 rounded-md text-white bg-gradient-to-r from-indigo-600 to-violet-600">
                  Verify & Create Account
                </button>
              </form>

              <button
                onClick={() => setSignupStep("details")}
                className="block mt-8 mx-auto text-violet-600"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

