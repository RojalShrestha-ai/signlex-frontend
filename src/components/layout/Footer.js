/**
 * SignLex Frontend - Footer
 * Author: Pawan Rijal
 */

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-lg font-bold text-white">
              Sign<span className="text-primary-400">Lex</span>
            </span>
            <p className="text-sm mt-1">
              AI-Powered Sign Language Learning Platform
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/learn" className="hover:text-white transition-colors">
              Learn
            </Link>
            <Link
              href="/practice"
              className="hover:text-white transition-colors"
            >
              Practice
            </Link>
            <Link
              href="/leaderboard"
              className="hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
          </div>
          <p className="text-sm">
            &copy; 2026 SignLex Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
