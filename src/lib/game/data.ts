export type MockTest = {
  id: string
  title: string
  description: string
  questions: number
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  bestScore?: number
  attempts: number
}

export type PracticeMode = {
  id: string
  title: string
  description: string
  duration: string
  xp: number
  color: string
}

export type Question = {
  id: string
  prompt: string
  answer: string
  options: string[]
  hint?: string
}

export const mockTests: MockTest[] = [
  {
    id: 'mt-1',
    title: 'Alphabet Mastery',
    description: 'Test your knowledge of the full ASL alphabet',
    questions: 26,
    duration: 15,
    difficulty: 'easy',
    bestScore: 92,
    attempts: 3,
  },
  {
    id: 'mt-2',
    title: 'Numbers & Counting',
    description: 'Recognize signed numbers from 1 to 100',
    questions: 20,
    duration: 12,
    difficulty: 'easy',
    bestScore: 85,
    attempts: 2,
  },
  {
    id: 'mt-3',
    title: 'Everyday Vocabulary',
    description: 'Common words and phrases in daily conversation',
    questions: 30,
    duration: 20,
    difficulty: 'medium',
    attempts: 0,
  },
  {
    id: 'mt-4',
    title: 'Full Fluency Test',
    description: 'Comprehensive exam covering all topics',
    questions: 50,
    duration: 45,
    difficulty: 'hard',
    attempts: 0,
  },
]

export const questionBank: Question[] = [
  {
    id: 'q-a',
    prompt: 'Which letter does this closed-fist sign represent?',
    answer: 'A',
    options: ['A', 'E', 'S', 'O'],
    hint: 'The thumb rests alongside the fist.',
  },
  {
    id: 'q-b',
    prompt: 'Four fingers extended, thumb tucked — which letter is this?',
    answer: 'B',
    options: ['B', 'F', 'H', 'U'],
  },
  {
    id: 'q-c',
    prompt: 'The hand curls into a "C" shape. Which letter?',
    answer: 'C',
    options: ['G', 'C', 'O', 'E'],
  },
  {
    id: 'q-d',
    prompt: 'Index finger up, other fingers touching thumb — which letter?',
    answer: 'D',
    options: ['D', 'L', 'I', 'Z'],
  },
  {
    id: 'q-e',
    prompt: 'Fingers curled with the thumb across the fingertips — which letter?',
    answer: 'E',
    options: ['A', 'S', 'E', 'O'],
  },
  {
    id: 'q-hello',
    prompt: 'Open hand moving away from the forehead in a salute — what word?',
    answer: 'Hello',
    options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'],
  },
  {
    id: 'q-thanks',
    prompt: 'Fingers touch the chin, then move forward — what word?',
    answer: 'Thank you',
    options: ['Thank you', 'Please', 'Sorry', 'Hello'],
  },
  {
    id: 'q-yes',
    prompt: 'A fist nodding up and down like a head nod — what word?',
    answer: 'Yes',
    options: ['Yes', 'No', 'Maybe', 'Okay'],
  },
  {
    id: 'q-no',
    prompt: 'Index and middle fingers closing onto the thumb — what word?',
    answer: 'No',
    options: ['No', 'Yes', 'Stop', 'Wait'],
  },
  {
    id: 'q-family',
    prompt: 'Both hands shape an "F" and form a circle — what word?',
    answer: 'Family',
    options: ['Friends', 'Family', 'Group', 'Team'],
  },
  {
    id: 'q-one',
    prompt: 'One finger pointing up, palm facing out — which number?',
    answer: '1',
    options: ['1', '5', '10', '4'],
  },
  {
    id: 'q-two',
    prompt: 'Index and middle finger up, palm out — which number?',
    answer: '2',
    options: ['2', '7', '3', 'V'],
  },
  {
    id: 'q-three',
    prompt: 'Thumb, index and middle finger extended — which number?',
    answer: '3',
    options: ['3', '6', '8', '9'],
  },
  {
    id: 'q-i-love-you',
    prompt: 'Thumb, index finger and pinky extended — what phrase?',
    answer: 'I love you',
    options: ['I love you', 'Goodbye', 'See you', 'Peace'],
  },
  {
    id: 'q-sorry',
    prompt: 'A-hand making a circle over the chest — what word?',
    answer: 'Sorry',
    options: ['Sorry', 'Please', 'Thanks', 'Help'],
  },
  {
    id: 'q-help',
    prompt: 'One flat hand supporting a closed fist, lifting upward — what word?',
    answer: 'Help',
    options: ['Help', 'Give', 'Take', 'Need'],
  },
  {
    id: 'q-good',
    prompt: 'Flat hand moves from chin down onto the opposite palm — what word?',
    answer: 'Good',
    options: ['Good', 'Bad', 'Great', 'Nice'],
  },
  {
    id: 'q-name',
    prompt: 'Two fingers tap on top of the opposite two fingers — what word?',
    answer: 'Name',
    options: ['Name', 'Friend', 'Meet', 'Call'],
  },
  {
    id: 'q-eat',
    prompt: 'Bunched fingers tapping the lips — what word?',
    answer: 'Eat',
    options: ['Eat', 'Drink', 'Sleep', 'Speak'],
  },
  {
    id: 'q-drink',
    prompt: 'C-hand tilting toward the mouth — what word?',
    answer: 'Drink',
    options: ['Drink', 'Eat', 'Cup', 'Water'],
  },
]

export function pickQuestions(count: number, offset = 0): Question[] {
  const result: Question[] = []
  for (let i = 0; i < count; i++) {
    result.push(questionBank[(i + offset) % questionBank.length])
  }
  return result
}

export const practiceModes: PracticeMode[] = [
  {
    id: 'ai-recognition',
    title: 'AI Sign Recognition',
    description: 'Use your camera to sign letters — our AI checks in real time',
    duration: 'Untimed',
    xp: 60,
    color: '#10B981',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Review signs at your own pace',
    duration: 'Untimed',
    xp: 20,
    color: '#0064B2',
  },
  {
    id: 'quick-fire',
    title: 'Quick Fire',
    description: 'Answer as many as you can in 60 seconds',
    duration: '1 min',
    xp: 40,
    color: '#EF4444',
  },
  {
    id: 'daily-challenge',
    title: 'Daily Challenge',
    description: "Today's curated mix — refreshes in 8h",
    duration: '5 min',
    xp: 100,
    color: '#FFD51D',
  },
  {
    id: 'word-builder',
    title: 'Word Builder',
    description: 'Sign full words letter-by-letter',
    duration: '5 min',
    xp: 50,
    color: '#00A86B',
  },
  {
    id: 'streak-saver',
    title: 'Streak Saver',
    description: 'Short session to keep your streak alive',
    duration: '2 min',
    xp: 25,
    color: '#F59E0B',
  },
  {
    id: 'boss-battle',
    title: 'Boss Battle',
    description: 'Take on a level review challenge',
    duration: '10 min',
    xp: 150,
    color: '#8B5CF6',
  },
]
