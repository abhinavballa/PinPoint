"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Globe, Target } from "lucide-react"

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<"country" | "city" | null>(null)
  const router = useRouter()

  const handleStartGame = () => {
    if (selectedMode) {
      router.push(`/game?mode=${selectedMode}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Target className="h-12 w-12 text-indigo-600 mr-3" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">PinPoint</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Test your geography knowledge by asking strategic yes/no questions to discover hidden locations around the
          world!
        </p>
      </div>

      {/* Game Mode Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Choose Your Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant={selectedMode === "country" ? "default" : "outline"}
              className={`h-24 text-lg font-semibold transition-all ${
                selectedMode === "country"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "hover:bg-indigo-50 border-2 hover:border-indigo-300"
              }`}
              onClick={() => setSelectedMode("country")}
            >
              <div className="flex flex-col items-center space-y-2">
                <Globe className="h-8 w-8" />
                <span>Pinpoint the Country</span>
              </div>
            </Button>

            <Button
              variant={selectedMode === "city" ? "default" : "outline"}
              className={`h-24 text-lg font-semibold transition-all ${
                selectedMode === "city"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "hover:bg-indigo-50 border-2 hover:border-indigo-300"
              }`}
              onClick={() => setSelectedMode("city")}
            >
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="h-8 w-8" />
                <span>Pinpoint the City</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Play</h3>
            <p className="text-blue-800">
              Ask up to 20 yes/no questions to figure out the place. You can make a guess at any time! The faster you
              guess correctly, the higher your score on the leaderboard.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Start Game Button */}
      <div className="text-center">
        <Button
          onClick={handleStartGame}
          disabled={!selectedMode}
          className="px-12 py-4 text-xl font-semibold bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {selectedMode ? "Start Game" : "Select a Mode First"}
        </Button>
      </div>
    </div>
  )
}
