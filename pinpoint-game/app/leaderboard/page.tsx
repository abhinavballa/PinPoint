"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, Clock, HelpCircle } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  mode: "country" | "city"
  time: string
  questions: number
}

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "GeoMaster", mode: "country", time: "2:34", questions: 8 },
  { rank: 2, username: "MapExplorer", mode: "city", time: "3:12", questions: 12 },
  { rank: 3, username: "WorldTraveler", mode: "country", time: "3:45", questions: 10 },
  { rank: 4, username: "CityHunter", mode: "city", time: "4:01", questions: 15 },
  { rank: 5, username: "AtlasKing", mode: "country", time: "4:23", questions: 14 },
  { rank: 6, username: "Navigator", mode: "city", time: "4:56", questions: 16 },
  { rank: 7, username: "Compass", mode: "country", time: "5:12", questions: 18 },
  { rank: 8, username: "Wanderer", mode: "city", time: "5:34", questions: 17 },
  { rank: 9, username: "Explorer", mode: "country", time: "5:47", questions: 19 },
  { rank: 10, username: "Adventurer", mode: "city", time: "6:02", questions: 20 },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />
    default:
      return <span className="text-lg font-bold text-gray-600">#{rank}</span>
  }
}

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Leaderboard</h1>
        <p className="text-gray-600">Top 10 fastest players today</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Today's Champions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Player</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Mode</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Questions</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      entry.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-transparent" : ""
                    }`}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center">{getRankIcon(entry.rank)}</div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-medium text-gray-900">{entry.username}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.mode === "country" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {entry.mode === "country" ? "🌍 Country" : "🏙️ City"}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-mono text-gray-900">{entry.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-1">
                        <HelpCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">{entry.questions}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Leaderboard resets daily at midnight UTC. Play now to claim your spot!</p>
      </div>
    </div>
  )
}
