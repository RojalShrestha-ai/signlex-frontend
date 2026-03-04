/**
 * SignLex Frontend - User Profile Page
 * Author: Pawan Rijal
 * 
 * Status: ~15% complete (stub)
 *   - Layout placeholder with user info sections
 *   - Profile data from Firebase TODO
 *   - Edit profile functionality TODO
 */

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-primary-600">👤</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">User Name</p>
            <p className="text-sm text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Learning Stats
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total XP</p>
            <p className="text-xl font-bold">0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-xl font-bold">0 days</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Signs Mastered</p>
            <p className="text-xl font-bold">0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tests Completed</p>
            <p className="text-xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
