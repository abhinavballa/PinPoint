"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameChat from "@/components/game-chat"
import Timer from "@/components/timer"
import { Send, Target, ArrowLeft } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface ChatMessage {
  id: number
  type: "question" | "answer"
  content: string
  timestamp: Date
}

export default function GamePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") as "country" | "city"

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentGuess, setCurrentGuess] = useState("")
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [gameStartTime] = useState(new Date())
  const [isGameOver, setIsGameOver] = useState(false)
  const [secretLocation] = useState(() => {
    // In a real app, this would be fetched from your game database
    const countries = ["France", "Japan", "Brazil", "Egypt", "Australia"]
    const cities = ["Paris", "Tokyo", "New York", "London", "Sydney"]
    const locations = mode === "country" ? countries : cities
    return locations[Math.floor(Math.random() * locations.length)]
  })

  // Real AI response using AI SDK
  const getAIResponse = async (question: string, secretLocation: string, mode: string): Promise<string> => {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: `You are playing a geography guessing game. The secret ${mode} is "${secretLocation}". 
               Answer the user's yes/no question with only "Yes", "No", or "Maybe" (if uncertain).
               Be accurate about geographical facts.`,
        prompt: question,
      })

      // Ensure response is only Yes/No/Maybe
      const cleanResponse = text.trim()
      if (cleanResponse.toLowerCase().includes("yes")) return "Yes"
      if (cleanResponse.toLowerCase().includes("no")) return "No"
      return "Maybe"
    } catch (error) {
      console.error("AI response error:", error)
      return "Maybe" // Fallback response
    }
  }

  const handleSubmitQuestion = async () => {
    if (!currentQuestion.trim() || questionsAsked >= 20 || isGameOver) return

    const questionMessage: ChatMessage = {
      id: Date.now(),
      type: "question",
      content: currentQuestion,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, questionMessage])

    // Get AI response
    const aiResponse = await getAIResponse(currentQuestion, secretLocation, mode)

    const answerMessage: ChatMessage = {
      id: Date.now() + 1,
      type: "answer",
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, answerMessage])
    setQuestionsAsked((prev) => prev + 1)
    setCurrentQuestion("")
  }

  const handleSubmitGuess = () => {
    if (!currentGuess.trim() || isGameOver) return

    // Mock guess validation - in a real app, this would check against the correct answer
    const isCorrect = Math.random() > 0.7 // 30% chance of being correct for demo

    const guessMessage: ChatMessage = {
      id: Date.now(),
      type: "question",
      content: `My guess: ${currentGuess}`,
      timestamp: new Date(),
    }

    const resultMessage: ChatMessage = {
      id: Date.now() + 1,
      type: "answer",
      content: isCorrect ? "Correct! 🎉" : "Incorrect, keep trying!",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, guessMessage, resultMessage])

    if (isCorrect) {
      setIsGameOver(true)
    }

    setCurrentGuess("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: "question" | "guess") => {
    if (e.key === "Enter") {
      if (type === "question") {
        handleSubmitQuestion()
      } else {
        handleSubmitGuess()
      }
    }
  }

  if (!mode) {
    router.push("/")
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/")} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Menu</span>
        </Button>

        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Mode</p>
            <p className="font-semibold capitalize">{mode}</p>
          </div>
          <Timer startTime={gameStartTime} isActive={!isGameOver} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Game Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <GameChat messages={messages} />

              {/* Question Input */}
              <div className="mt-4 space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask a yes/no question..."
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "question")}
                    disabled={questionsAsked >= 20 || isGameOver}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubmitQuestion}
                    disabled={!currentQuestion.trim() || questionsAsked >= 20 || isGameOver}
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Guess Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder={`Enter your ${mode} guess...`}
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "guess")}
                    disabled={isGameOver}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubmitGuess}
                    disabled={!currentGuess.trim() || isGameOver}
                    variant="secondary"
                    className="px-4"
                  >
                    Guess
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions Asked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">
                <span
                  className={
                    questionsAsked >= 18 ? "text-red-600" : questionsAsked >= 15 ? "text-yellow-600" : "text-green-600"
                  }
                >
                  {questionsAsked}
                </span>
                <span className="text-gray-400"> / 20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    questionsAsked >= 18 ? "bg-red-500" : questionsAsked >= 15 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${(questionsAsked / 20) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {questionsAsked >= 20 && !isGameOver && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800 text-center font-semibold">No more questions! Make your final guess!</p>
              </CardContent>
            </Card>
          )}

          {isGameOver && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-green-800 text-center font-semibold">🎉 Congratulations! You won!</p>
                <Button onClick={() => router.push("/")} className="w-full mt-4">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
