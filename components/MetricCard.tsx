interface Props {
  title: string
  value: string | number
}

export default function MetricCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}