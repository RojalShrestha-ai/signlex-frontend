/**
 * SignLex Frontend - Mock Test Page
 * Author: Pawan Rijal
 * 
 * Status: ~10% complete (stub layout only)
 *   - Page layout and placeholder UI
 *   - Timer display area
 *   - Question display area
 *   - Timed test logic TODO
 *   - Scoring and results TODO
 *   - Webcam integration for sign recognition TODO
 */

export default function MockTestPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Test</h1>
      <p className="text-gray-500 mb-8">
        Test your ASL knowledge with timed assessments.
      </p>

      {/* Test not started state */}
      <div className="card text-center py-16">
        <p className="text-5xl mb-4">📝</p>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          ASL Alphabet Test
        </h2>
        <p className="text-gray-500 mb-6">
          26 signs &bull; 5 minutes &bull; Show each sign to the webcam
        </p>
        <button className="btn-primary text-lg px-8">Start Test</button>
      </div>
    </div>
  );
}
