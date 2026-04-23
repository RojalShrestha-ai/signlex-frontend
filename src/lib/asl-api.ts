const ASL_API_URL = `${process.env.NEXT_PUBLIC_AI_HOST}/api/predict`

export type PredictionResult = {
  prediction: string
  confidence: number
}

export async function predictASLSign(imageBase64: string): Promise<PredictionResult> {
  const res = await fetch(ASL_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64, enhanced: true }),
  })

  if (!res.ok) {
    throw new Error(`Prediction failed: ${res.status}`)
  }

  const data = await res.json()

  return {
    prediction: (
      data.prediction ?? data.label ?? data.class ?? data.letter ?? ''
    )
      .toString()
      .toUpperCase(),
    confidence:
      typeof data.confidence === 'number'
        ? data.confidence
        : (data.score ?? data.probability ?? 0),
  }
}
