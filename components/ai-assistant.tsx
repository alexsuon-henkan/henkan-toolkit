"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssistantResponse {
  javascript: string
  explanation: string
}

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AssistantResponse | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.")
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (!prompt.trim()) {
      setError("Prompt is required.")
      return
    }
    const formData = new FormData()
    formData.append("prompt", prompt)
    if (image) formData.append("image", image)

    setLoading(true)
    try {
      const res = await fetch("/api/ai-assistant", { method: "POST", body: formData })
      const text = await res.text()
      if (!res.ok) {
        throw new Error(text)
      }
      const data: AssistantResponse = JSON.parse(text)
      setResult(data)
    } catch (err) {
      setError((err as Error).message || "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    if (result?.javascript) {
      navigator.clipboard.writeText(result.javascript)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">AI Assistant (Claude 4) – Banners &amp; Modals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium">
                Prompt<span className="text-destructive">*</span>
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Create a newsletter signup modal with an email field and a close icon…"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Screenshot (optional)</label>
              <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Screenshot preview"
                  className="mt-2 max-h-48 rounded border"
                />
              )}
            </div>

            <Button disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate JavaScript
            </Button>
          </form>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Developer Review Recommended</AlertTitle>
                <AlertDescription>
                  The generated code is an 80–85 % starting point – test &amp; refine before production.
                </AlertDescription>
              </Alert>

              <div className="relative">
                <Textarea className={cn("font-mono text-sm h-60")} readOnly value={result.javascript} />
                <Button size="icon" variant="secondary" className="absolute top-2 right-2" onClick={copyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="mb-1 font-semibold">Explanation</h3>
                <p className="text-sm whitespace-pre-line">{result.explanation}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
