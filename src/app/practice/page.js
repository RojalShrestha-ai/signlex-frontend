/**
 * SignLex Frontend - Practice Page (Webcam Gesture Recognition)
 * Author: Pawan Rijal
 * 
 * Status: ~10% complete (layout stub only)
 *   - Webcam feed display area defined
 *   - Accuracy score overlay zone defined
 *   - Feedback area placeholder
 *   - Actual webcam integration TODO
 *   - MediaPipe overlay TODO
 *   - Real-time scoring TODO
 */

export default function PracticePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Mode</h1>
      <p className="text-gray-500 mb-8">
        Use your webcam to practice ASL signs with real-time AI feedback.
      </p>

      {/* Webcam Feed Area (placeholder) */}
      <div className="bg-gray-900 rounded-xl overflow-hidden mb-6 relative">
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-lg">Webcam Feed</p>
            <p className="text-sm mt-1">Camera access required</p>
            <button className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg text-sm">
              Enable Camera
            </button>
          </div>
        </div>
      </div>

      {/* Current Sign + Accuracy */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Current Sign</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">A</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Accuracy</p>
          <p className="text-3xl font-bold text-gray-300 mt-1">--.--</p>
        </div>
      </div>

      {/* Feedback Area */}
      <div className="card bg-yellow-50 border-yellow-200">
        <p className="text-yellow-700 text-center">
          Position your hand in front of the camera to begin practice.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center mt-6">
        <button className="btn-primary">Next Sign</button>
        <button className="px-6 py-3 rounded-lg bg-red-100 text-red-600 font-medium">
          End Session
        </button>
      </div>
    </div>
  );
}
