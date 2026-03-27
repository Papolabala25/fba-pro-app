interface Props {
  score: number
}

export default function ScoreCircle({ score }: Props) {
  const color =
    score > 70
      ? "text-green-500"
      : score > 40
      ? "text-yellow-500"
      : "text-red-500"

  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-5xl font-bold ${color}`}
      >
        {score}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        AROGA SCORE
      </p>
    </div>
  )
}