import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface WeeklyMDEResult {
  week: number
  mde: number
  visitorsPerVariant: number
}

interface WeeklyMDETableProps {
  results: WeeklyMDEResult[] | null
}

export function WeeklyMDETable({ results }: WeeklyMDETableProps) {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <p>No weekly MDE results available.</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number of Weeks Running Test</TableHead>
            <TableHead>MDE (% of baseline)</TableHead>
            <TableHead>Visitors Per Variant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.week}>
              <TableCell>{result.week}</TableCell>
              <TableCell>{result.mde.toFixed(2)}%</TableCell>
              <TableCell>{result.visitorsPerVariant.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
