export async function fetchApiStatus() {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const apiEndpoints = [
    { name: "Frequentist Calculator API", status: "Operational", responseTime: "45ms" },
    { name: "Bayesian Calculator API", status: "Operational", responseTime: "52ms" },
    { name: "Revenue Calculator API", status: "Degraded Performance", responseTime: "1200ms" },
    { name: "Duration Calculator API", status: "Operational", responseTime: "38ms" },
    { name: "AOV Calculator API", status: "Operational", responseTime: "41ms" },
    { name: "Sankey Diagram API", status: "Partial Outage", responseTime: "N/A" },
    { name: "Waterfall Chart API", status: "Operational", responseTime: "63ms" },
  ]

  return apiEndpoints.map((endpoint) => ({
    ...endpoint,
    status: Math.random() > 0.8 ? "Degraded Performance" : endpoint.status,
    responseTime:
      endpoint.status === "Operational" ? `${Math.floor(Math.random() * 100 + 30)}ms` : endpoint.responseTime,
  }))
}
