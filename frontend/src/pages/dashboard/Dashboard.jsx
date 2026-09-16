import { useNavigate } from "react-router-dom";

import useAuthStore from "../../stores/authStore";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // USER NAME
  // =====================================================

  const userName =
    user?.name?.split(" ")[0] || "there";

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold tracking-tight"
          >
            Career
            <span className="text-blue-500">
              OS
            </span>
          </button>

          {/* Right */}

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>

            {/* Avatar */}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
              {(user?.name?.charAt(0) ||
                "U").toUpperCase()}
            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoading}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "..."
                : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 p-6 sm:p-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              CareerOS Dashboard
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back,{" "}
              <span className="text-blue-400">
                {userName}
              </span>
              !
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage your career profile, track
              job applications, prepare for
              interviews, and use AI-powered
              career tools from one place.
            </p>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Applications */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-bold">
                  0
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 px-3 py-2 text-xl">
                💼
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              No applications yet
            </p>
          </div>

          {/* Interviews */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Interviews
                </p>

                <p className="mt-2 text-3xl font-bold">
                  0
                </p>
              </div>

              <div className="rounded-xl bg-purple-500/10 px-3 py-2 text-xl">
                🎯
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              No interviews scheduled
            </p>
          </div>

          {/* Resume */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Resumes
                </p>

                <p className="mt-2 text-3xl font-bold">
                  0
                </p>
              </div>

              <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xl">
                📄
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Create your first resume
            </p>
          </div>

          {/* Profile */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Profile
                </p>

                <p className="mt-2 text-3xl font-bold">
                  0%
                </p>
              </div>

              <div className="rounded-xl bg-orange-500/10 px-3 py-2 text-xl">
                👤
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Complete your career profile
            </p>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Quick actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Start building your career workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Profile */}

            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-slate-900/80"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                👤
              </div>

              <h3 className="font-semibold">
                Career Profile
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Add your skills, education and
                experience.
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-blue-400 group-hover:text-blue-300">
                Open profile →
              </span>
            </button>

            {/* Jobs */}

            <button
              type="button"
              onClick={() =>
                navigate("/jobs")
              }
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-slate-900/80"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                💼
              </div>

              <h3 className="font-semibold">
                Job Tracker
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Track applications and job
                opportunities.
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-purple-400 group-hover:text-purple-300">
                View jobs →
              </span>
            </button>

            {/* Resume */}

            <button
              type="button"
              onClick={() =>
                navigate("/resumes")
              }
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-slate-900/80"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                📄
              </div>

              <h3 className="font-semibold">
                Resume
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Build and manage your professional
                resume.
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-emerald-400 group-hover:text-emerald-300">
                Manage resume →
              </span>
            </button>

            {/* AI */}

            <button
              type="button"
              onClick={() =>
                navigate("/ai/career-advice")
              }
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-slate-900/80"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-xl">
                ✨
              </div>

              <h3 className="font-semibold">
                AI Career Assistant
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Get AI-powered career guidance
                and insights.
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-pink-400 group-hover:text-pink-300">
                Open AI →
              </span>
            </button>
          </div>
        </section>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your CareerOS account information.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                <span className="text-xs text-slate-500">
                  Role
                </span>

                <p className="text-sm font-medium capitalize text-slate-200">
                  {user?.role || "user"}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                <span className="text-xs text-emerald-500/70">
                  Status
                </span>

                <p className="text-sm font-medium text-emerald-400">
                  {user?.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;