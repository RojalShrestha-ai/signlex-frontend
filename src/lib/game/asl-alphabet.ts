export type ASLLetter = {
  letter: string
  description: string
}

export const aslAlphabet: ASLLetter[] = [
  { letter: 'A', description: 'Make a fist with your thumb resting on the side' },
  { letter: 'B', description: 'Hold four fingers straight up, thumb tucked across palm' },
  { letter: 'C', description: 'Curve your hand into a C shape' },
  { letter: 'D', description: 'Touch thumb to middle, ring & pinky; index points up' },
  { letter: 'E', description: 'Curl all fingers down, thumb tucked under fingertips' },
  { letter: 'F', description: 'Circle with thumb and index, other three fingers spread up' },
  { letter: 'G', description: 'Point index and thumb sideways, other fingers closed' },
  { letter: 'H', description: 'Extend index and middle fingers together, pointing sideways' },
  { letter: 'I', description: 'Make a fist with pinky finger extended up' },
  { letter: 'J', description: 'Start with I hand, trace a J shape with your pinky' },
  { letter: 'K', description: 'Index and middle finger in a V, thumb between them' },
  { letter: 'L', description: 'Make an L shape with thumb and index finger' },
  { letter: 'M', description: 'Tuck thumb under first three fingers on palm' },
  { letter: 'N', description: 'Tuck thumb under first two fingers on palm' },
  { letter: 'O', description: 'Curve all fingers to touch the thumb, forming an O' },
  { letter: 'P', description: 'Like K but angled downward' },
  { letter: 'Q', description: 'Like G but pointing downward' },
  { letter: 'R', description: 'Cross your index and middle fingers' },
  { letter: 'S', description: 'Make a fist with thumb over the front of fingers' },
  { letter: 'T', description: 'Tuck thumb between index and middle finger' },
  { letter: 'U', description: 'Hold index and middle fingers together, pointing up' },
  { letter: 'V', description: 'Spread index and middle fingers apart in a V' },
  { letter: 'W', description: 'Spread index, middle, and ring fingers apart' },
  { letter: 'X', description: 'Make a fist with index finger bent like a hook' },
  { letter: 'Y', description: 'Extend thumb and pinky, close other fingers' },
  { letter: 'Z', description: 'Point index finger and trace a Z in the air' },
]

export function getLetterInfo(letter: string): ASLLetter | undefined {
  return aslAlphabet.find((l) => l.letter === letter.toUpperCase())
}

export function getRandomLetters(count: number, seed?: number): string[] {
  const letters = aslAlphabet.map((l) => l.letter)
  const shuffled = [...letters]
  let s = seed ?? Math.floor(Math.random() * 10000)
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length])
  }
  return result
}
