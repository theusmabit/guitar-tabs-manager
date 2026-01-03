"use client"

import { Music, Heart, TrendingUp, Plus, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Song, Folder } from "@/lib/types"

interface HomepageProps {
  songs: Song[]
  favoriteSongs: Song[]
  folders: Folder[]
  onViewSong: (song: Song) => void
  onNavigate: (view: "library" | "favorites" | "folders" | "add") => void
}

export function Homepage({ songs, favoriteSongs, folders, onViewSong, onNavigate }: HomepageProps) {
  const extractChords = (content: string): string[] => {
    const chordPattern = /\b([A-G](#|b)?(m|maj|min|dim|aug|sus|add)?[0-9]?)\b/g
    const matches = content.match(chordPattern) || []
    return Array.from(new Set(matches)).slice(0, 6)
  }

  const getDifficulty = (content: string): string => {
    const chords = extractChords(content)
    if (chords.length <= 3) return "Beginner"
    if (chords.length <= 5) return "Intermediate"
    return "Advanced"
  }

  const getGenreBadge = (genre: string) => {
    const colors: Record<string, string> = {
      Rock: "bg-pink-100 text-pink-700",
      MPB: "bg-purple-100 text-purple-700",
      Forró: "bg-yellow-100 text-yellow-700",
      Romance: "bg-rose-100 text-rose-700",
      Classic: "bg-blue-100 text-blue-700",
      Epic: "bg-indigo-100 text-indigo-700",
    }
    return colors[genre] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Find your <span className="text-primary">perfect</span> chord
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access thousands of guitar chords and tabs. Learn, practice, and master your favorite songs with our
            easy-to-use chord viewer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate("library")}
            >
              <Music className="w-5 h-5 mr-2" />
              Browse Songs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-accent bg-transparent"
              onClick={() => onNavigate("add")}
            >
              Upload Your Own
              <Plus className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Top Hits
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Most viewed songs this week</p>
            </div>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("library")}
            >
              View All →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {songs.slice(0, 4).map((song, index) => {
              const chords = extractChords(song.content)
              const difficulty = getDifficulty(song.content)
              const views = Math.floor(Math.random() * 30000) + 5000

              return (
                <Card
                  key={song.id}
                  className="bg-card border-border hover:shadow-md transition-all cursor-pointer group relative"
                  onClick={() => onViewSong(song)}
                >
                  <CardContent className="p-4">
                    {song.isFavorite && (
                      <div className="absolute top-4 right-4">
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </div>
                    )}

                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Music className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{song.artist}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {chords.map((chord) => (
                        <Badge
                          key={chord}
                          variant="secondary"
                          className="bg-primary/10 text-primary text-xs px-2 py-0.5"
                        >
                          {chord}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={
                          difficulty === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : difficulty === "Intermediate"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                        }
                      >
                        {difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Browse by Genre</h2>
            <p className="text-muted-foreground text-sm mt-1">Explore songs across different musical styles</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                name: "Rock",
                icon: "🎸",
                color: "from-pink-400 to-rose-500",
                count: songs.filter((s) => s.tags?.includes("Rock")).length || 1250,
              },
              { name: "Pop", icon: "🎤", color: "from-purple-400 to-indigo-500", count: 980 },
              { name: "Country", icon: "🥁", color: "from-yellow-400 to-orange-500", count: 750 },
              { name: "Blues", icon: "🎷", color: "from-amber-400 to-yellow-500", count: 420 },
              { name: "Folk", icon: "🪕", color: "from-violet-400 to-purple-500", count: 380 },
              { name: "Jazz", icon: "🎹", color: "from-slate-400 to-indigo-500", count: 290 },
            ].map((genre) => (
              <Card
                key={genre.name}
                className="bg-card border-border hover:shadow-md transition-all cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${genre.color} flex items-center justify-center mb-3 text-3xl`}
                  >
                    {genre.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{genre.count} songs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-12 py-8 px-4 md:px-8 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">
              Chord<span className="text-primary">Master</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Your ultimate destination for guitar chords and tabs</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <button className="hover:text-foreground transition-colors">About</button>
            <button className="hover:text-foreground transition-colors">Contact</button>
            <button className="hover:text-foreground transition-colors">Privacy</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
