"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, ImageIcon, Sparkles, Copy, CheckCircle, Zap, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiResponse {
  code: string
  explanation: string
}

export function AIAssistant() {
  const [prompt, setPrompt] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [copied, setCopied] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const onFileChange = useCallback((f: File | null) => {
    if (!f) {
      setFile(null)
      setPreviewURL(null)
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB")
      return
    }
    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file")
      return
    }
    setFile(f)
    setResult(null)
    setError(null)
    setPreviewURL(URL.createObjectURL(f))
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    onFileChange(f || null)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    onFileChange(f || null)
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return setError("Please enter a prompt.")
    if (!file) return setError("Please upload an image.")

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const fd = new FormData()
      fd.append("prompt", prompt.trim())
      fd.append("image", file)

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const errorText = await res.text()
        let errorMsg = errorText
        try {
          const errorJson = JSON.parse(errorText)
          errorMsg = errorJson.error || `Request failed with status: ${res.status}`
        } catch {
          // The error response was not JSON, use the raw text.
        }
        throw new Error(errorMsg)
      }

      const json: ApiResponse = await res.json()
      setResult(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const examplePrompts = [
    "Add a banner at the top for a flash sale with a countdown.",
    "Create a modal to capture newsletter sign-ups on exit intent.",
    "Show a cookie consent banner at the bottom of the page.",
    "Display a modal with a special offer after 10 seconds on the page.",
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Assistant
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              NEW
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              <Zap className="w-3 h-3 mr-1" />
              Banners & Modals
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-700">
            Quickly generate the foundational code for website **banners** and **modals**. Describe what you want, and
            AI will build the JavaScript structure.
          </CardDescription>
        </CardHeader>
      </Card>

      <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
        <Info className="h-4 w-4 !text-yellow-600" />
        <AlertTitle className="font-semibold !text-yellow-900">Developer Review Recommended</AlertTitle>
        <AlertDescription>
          The generated code is a solid starting point (~80-85% complete). It is intended to be reviewed, tested, and
          finalized by a developer before production use.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create Your Banner or Modal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Screenshot (for context) <span className="text-red-500">*</span>
            </label>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={cn(
                "flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                file ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50",
              )}
            >
              {previewURL ? (
                <img
                  src={previewURL || "/placeholder.svg"}
                  alt="preview"
                  className="h-full w-full object-contain p-2 rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-gray-600 mb-1 font-medium">Click to upload or drag & drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB</p>
                </div>
              )}
              <Input ref={inputRef} type="file" accept="image/*" onChange={handleFileInput} className="sr-only" />
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Banner/Modal Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Create a banner at the top of the page for free shipping...'"
              rows={4}
            />
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Example Ideas
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {examplePrompts.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="text-left text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() => setPrompt(example)}
                >
                  • {example}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading || !prompt.trim() || !file}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Generated JavaScript</CardTitle>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy Code</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{result.code}</code>
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{result.explanation}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
