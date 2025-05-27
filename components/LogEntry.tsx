import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LogEntryProps {
  version: string
  date: string
  changes: string[]
}

export function LogEntry({ version, date, changes }: LogEntryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {version} - {date}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside">
          {changes.map((change, index) => (
            <li key={index}>{change}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
