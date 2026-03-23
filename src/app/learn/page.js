/**
 * SignLex Frontend - Learn Page
 * Author: Pawan Rijal
 * Status: 100% complete — renders the Flashcard component
 */

import Flashcard from "../../components/ui/Flashcard";

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Learn ASL</h1>
      <p className="text-gray-500 mb-8">
        Master the ASL alphabet with spaced-repetition flashcards.
      </p>
      <Flashcard />
    </div>
  );
}
