/**
 * SignLex Frontend - Learn Page (Flashcards & Drills)
 * Author: Pawan Rijal
 * 
 * Status: ~10% complete (stub layout only)
 *   - Page layout defined
 *   - Placeholder content for flashcard area
 *   - Flashcard flip animation TODO
 *   - Spaced repetition controls TODO
 *   - Drill interface TODO
 *   - Progress analytics TODO
 */

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Learn ASL</h1>
      <p className="text-gray-500 mb-8">
        Master the ASL alphabet with flashcards and progressive drills.
      </p>

      {/* Difficulty Selection */}
      <div className="flex gap-3 mb-8">
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <button
            key={level}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors"
          >
            {level}
          </button>
        ))}
      </div>

      {/* Flashcard Area (placeholder) */}
      <div className="card flex items-center justify-center min-h-[300px] mb-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🤟</p>
          <p className="text-xl font-semibold text-gray-700">
            Flashcard Component
          </p>
          <p className="text-gray-400 mt-2">
            Tap to flip &bull; Spaced repetition controls below
          </p>
        </div>
      </div>

      {/* Rating Buttons (placeholder) */}
      <div className="flex gap-3 justify-center mb-8">
        <button className="px-6 py-3 rounded-lg bg-red-100 text-red-600 font-medium">
          Hard
        </button>
        <button className="px-6 py-3 rounded-lg bg-yellow-100 text-yellow-600 font-medium">
          Good
        </button>
        <button className="px-6 py-3 rounded-lg bg-green-100 text-green-600 font-medium">
          Easy
        </button>
      </div>

      {/* Progress */}
      <div className="card">
        <p className="text-sm text-gray-500 mb-2">Session Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full w-0"></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">0 / 26 cards reviewed</p>
      </div>
    </div>
  );
}
