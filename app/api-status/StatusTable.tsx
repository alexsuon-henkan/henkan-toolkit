"use client"

import { useState, useEffect } from "react"
import { fetchApiStatus } from "@/utils/api"

interface ApiEndpoint {
  name: string
  status: string
  responseTime: string
}

interface StatusTableProps {
  apiEndpoints: ApiEndpoint[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Operational":
      return "bg-green-500"
    case "Degraded Performance":
      return "bg-yellow-500"
    case "Partial Outage":
      return "bg-orange-500"
    default:
      return "bg-red-500"
  }
}

export function StatusTable({ apiEndpoints: initialApiEndpoints }: StatusTableProps) {
  const [apiEndpoints, setApiEndpoints] = useState(initialApiEndpoints)

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const updatedEndpoints = await fetchApiStatus()
      setApiEndpoints(updatedEndpoints)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              API Endpoint
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {apiEndpoints.map((endpoint, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{endpoint.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(endpoint.status)} text-white`}
                >
                  {endpoint.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{endpoint.responseTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
