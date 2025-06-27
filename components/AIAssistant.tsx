"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, X, Loader2, Copy, Sparkles, Lightbulb, Code } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface GeneratedCode {
  explanation: string
  javascript: string
}

export function AIAssistant() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size cannot exceed 10MB.")
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const resetForm = () => {
    setPrompt("")
    setImage(null)
    setImagePreview(null)
    setError(null)
    setGeneratedCode(null)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt) {
      setError("Please enter a description for your banner or modal.")
      return
    }
    if (!image) {
      setError("Please upload a screenshot.")
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedCode(null)

    const formData = new FormData()
    formData.append("prompt", prompt)
    formData.append("image", image)

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        let errorMsg = `Error: ${res.status} ${res.statusText}`
        try {
          const errorJson = JSON.parse(errorText)
          errorMsg = errorJson.error || errorMsg
        } catch (e) {
          // It wasn't JSON, so the raw text is the error.
          errorMsg = errorText || errorMsg
        }
        throw new Error(errorMsg)
      }

      const data = await res.json()
      setGeneratedCode(data)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedCode?.javascript) {
      navigator.clipboard.writeText(generatedCode.javascript)
      toast({
        title: "Copied to clipboard!",
        description: "The JavaScript code has been copied.",
      })
    }
  }

  const examplePrompts = [
    "Add a banner at the top for a flash sale with a countdown.",
    "Create a modal to capture newsletter sign-ups on exit intent.",
    "Show a cookie consent banner at the bottom of the page.",
    "Display a modal with a special discount for first-time visitors.",
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground mt-2">Generate JavaScript for website banners & modals instantly.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Describe Your Component</CardTitle>
          <CardDescription>
            Upload a screenshot of the page and describe the banner or modal you want to create.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshot
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="mx-auto h-48 w-auto rounded-md"
                        />
                        <div
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setImage(null)
                            setImagePreview(null)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/png, image/jpeg, image/webp"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., 'Create a banner at the top of the page with a countdown to our Black Friday sale...'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-grow"
                  rows={8}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedCode && (
        <Card>
          <CardHeader>
            <CardTitle>2. Generated Code</CardTitle>
            <CardDescription>
              Here is the generated code and an explanation. Review and test it before use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Explanation
              </h3>
              <p className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-md border">
                {generatedCode.explanation}
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  JavaScript Code
                </h3>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
                <pre>
                  <code>{generatedCode.javascript}</code>
                </pre>
              </div>
            </div>
            <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
              <AlertTitle>Developer Review Recommended</AlertTitle>
              <AlertDescription>
                This AI-generated code is a starting point (approx. 80-85% complete). It should be reviewed, tested, and
                refined by a developer before use in a production environment.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {!isLoading && !generatedCode && (
        <Card>
          <CardHeader>
            <CardTitle>Example Ideas</CardTitle>
            <CardDescription>
              Need inspiration? Here are a few things you can ask the AI Assistant to create.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {examplePrompts.map((p, i) => (
                <li key={i} className="flex items-start">
                  <Sparkles className="h-4 w-4 mr-3 mt-1 flex-shrink-0 text-blue-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
