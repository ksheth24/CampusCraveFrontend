export default function SignedOutNav() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <a href = "/">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              🍜 CampusCrave
            </span>
          </div>
          </a>

          {/* Right Actions */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href = "/browse">
            <button className="text-gray-600 hover:text-gray-900 transition">
              Browse Meals
            </button>
            </a>
            <a href = "/auth/login">
            <button className="text-gray-600 hover:text-gray-900 transition">
              Login
            </button>
            </a>

            <a href = "/auth/register">
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:opacity-90 transition">
              Sign Up
            </button>
            </a>
          </div>
        </div>
      </nav>
    );
}