import { track } from "@vercel/analytics"

export function ExampleComponent() {
  const handleClick = () => {
    // Track a custom event
    track("button_clicked", { buttonName: "example_button" })

    // Your other click handling logic here
  }

  return <button onClick={handleClick}>Click me</button>
}
