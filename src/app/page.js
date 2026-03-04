/**
 * SignLex Frontend - Landing Page
 * Author: Pawan Rijal
 * 
 * The main landing page with hero section, feature highlights,
 * and call-to-action buttons.
 * 
 * Status: ~30% complete
 *   - Hero section with CTA implemented
 *   - Feature cards section implemented
 *   - How it works section implemented
 *   - Animations and illustrations TODO
 *   - Testimonials section TODO
 */

import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      title: "AI Gesture Recognition",
      description:
        "Real-time hand tracking using MediaPipe and TensorFlow.js for accurate sign language detection.",
      icon: "🤖",
    },
    {
      title: "Interactive Flashcards",
      description:
        "Learn ASL vocabulary with spaced repetition for optimal memorization and long-term retention.",
      icon: "📇",
    },
    {
      title: "Progress Tracking",
      description:
        "Track your learning journey with detailed analytics, streaks, and achievement badges.",
      icon: "📊",
    },
    {
      title: "Competitive Leaderboards",
      description:
        "Compete with learners worldwide through weekly and all-time rankings to stay motivated.",
      icon: "🏆",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Learn Sign Language{" "}
            <span className="text-primary-600">with AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Real-time gesture recognition powered by AI. Practice ASL with
            instant feedback, gamified learning, and track your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-lg px-8 py-4 inline-block"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Why SignLex?
          </h2>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
            A complete platform designed to make sign language learning
            accessible, effective, and fun.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Turn on your webcam",
                description: "Allow camera access and the AI starts tracking your hand movements instantly.",
              },
              {
                step: "2",
                title: "Practice signs",
                description: "Follow the lessons and practice ASL signs with real-time accuracy feedback.",
              },
              {
                step: "3",
                title: "Track progress",
                description: "Earn XP, maintain streaks, unlock achievements, and climb the leaderboard.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
