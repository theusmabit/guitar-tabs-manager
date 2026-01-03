"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Plus,
  ChevronDown,
  Columns2,
  Minus,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Song } from "@/lib/types"
import { transposeChord } from "@/lib/transpose"
import { Tuner } from "@/components/tuner"
import { Metronome } from "@/components/metronome"
import { MusicPlayer } from "@/components/music-player"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface SongViewerProps {
  song: Song
  onUpdateSong: (song: Song) => void
  onBack: () => void
}

export function SongViewer({ song, onUpdateSong, onBack }: SongViewerProps) {
  const [transpose, setTranspose] = useState(0)
  const [autoScroll, setAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(60)
  const [textSize, setTextSize] = useState(14)
  const [isEditing, setIsEditing] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [twoColumnMode, setTwoColumnMode] = useState(false)

  const [editForm, setEditForm] = useState({
    title: song.title,
    artist: song.artist,
    key: song.key,
    content: song.content,
    tags: song.tags.join(", "),
  })

  const transposedContent = transposeContent(song.content, transpose)

  const uniqueChords = extractUniqueChords(transposedContent)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoScroll) {
      const scrollAmount = scrollSpeed / 60
      interval = setInterval(() => {
        window.scrollBy({ top: scrollAmount, behavior: "smooth" })
      }, 16)
    }
    return () => clearInterval(interval)
  }, [autoScroll, scrollSpeed])

  const handleSaveEdit = () => {
    const updatedSong: Song = {
      ...song,
      title: editForm.title,
      artist: editForm.artist,
      key: editForm.key,
      content: editForm.content,
      tags: editForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }
    onUpdateSong(updatedSong)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex gap-6">
            {leftSidebarOpen && (
              <div className="hidden lg:block w-16 space-y-4">
                <div className="sticky top-20">{/* Quick actions */}</div>
              </div>
            )}

            <div className="flex-1 max-w-4xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl font-bold text-foreground mb-1">{song.title}</h1>
                  <p className="text-lg text-muted-foreground">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-y border-border bg-card/30 py-3 px-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsSaved(!isSaved)}
                    className="rounded-sm h-9"
                  >
                    <Heart className={`w-3.5 h-3.5 mr-1.5 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>

                  <Button variant="outline" size="sm" className="rounded-sm h-9 bg-transparent">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add to Setlist
                    <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Chords:</span>
                  {uniqueChords.slice(0, 4).map((chord, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-sm border-primary/30 bg-primary/5 text-primary text-sm px-2.5 py-0.5 font-medium"
                    >
                      {chord}
                    </Badge>
                  ))}
                  {uniqueChords.length > 4 && (
                    <span className="text-sm text-muted-foreground">+{uniqueChords.length - 4}</span>
                  )}
                </div>
              </div>

              {twoColumnMode ? (
                <Card className="rounded-sm border-border shadow-none mt-4">
                  <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <pre
                          className="font-mono whitespace-pre-wrap leading-relaxed"
                          style={{ fontSize: `${textSize}px` }}
                        >
                          {renderLyricsWithChords(getColumnContent(transposedContent, 0))}
                        </pre>
                      </div>
                      <div>
                        <pre
                          className="font-mono whitespace-pre-wrap leading-relaxed"
                          style={{ fontSize: `${textSize}px` }}
                        >
                          {renderLyricsWithChords(getColumnContent(transposedContent, 1))}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-sm border-border shadow-none mt-4">
                  <CardContent className="p-6 md:p-8">
                    <pre
                      className="font-mono whitespace-pre-wrap leading-relaxed"
                      style={{ fontSize: `${textSize}px` }}
                    >
                      {renderLyricsWithChords(transposedContent)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="hidden lg:flex items-start pt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="h-8 w-8 rounded-sm"
              >
                {rightSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>

            {rightSidebarOpen && (
              <div className="hidden lg:block w-80 space-y-4">
                <div className="sticky top-20 space-y-4">
                  {/* Music Player in the Sidebar */}
                  <MusicPlayer song={song} />

                  <Card className="rounded-sm border-border shadow-none">
                    <CardContent className="p-4 space-y-6">
                      {/* Transpose Control */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Transpose</label>
                        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-sm border border-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTranspose((t) => t - 1)}
                            className="h-8 w-8 p-0 rounded-sm hover:bg-background"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-xs font-bold flex-1 text-center">
                            {transpose === 0 ? "Original" : transpose > 0 ? `+${transpose}` : transpose}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTranspose((t) => t + 1)}
                            className="h-8 w-8 p-0 rounded-sm hover:bg-background"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Tool Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Auto-scroll */}
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Auto-scroll</label>
                          <div className="flex gap-1">
                            <Button
                              variant={autoScroll ? "default" : "outline"}
                              size="sm"
                              onClick={() => setAutoScroll(!autoScroll)}
                              className="flex-1 rounded-sm h-10 px-0"
                            >
                              {autoScroll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-sm">
                                  <ChevronDown className="w-3 h-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-3 bg-card border-border">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-xs font-medium">Speed</span>
                                    <span className="text-xs text-primary font-bold">{scrollSpeed}</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="30"
                                    max="180"
                                    value={scrollSpeed}
                                    onChange={(e) => setScrollSpeed(Number(e.target.value))}
                                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Layout Toggle */}
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Layout</label>
                          <Button
                            variant={twoColumnMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTwoColumnMode(!twoColumnMode)}
                            className="w-full rounded-sm h-10"
                          >
                            <Columns2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Text Size Control */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Text Appearance</label>
                        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-sm border border-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTextSize(Math.max(10, textSize - 1))}
                            className="h-8 w-8 p-0 rounded-sm hover:bg-background"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <div className="flex-1 flex items-center justify-center gap-1.5">
                            <Type className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-bold">{textSize}px</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTextSize(Math.min(32, textSize + 1))}
                            className="h-8 w-8 p-0 rounded-sm hover:bg-background"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-sm border-border shadow-none">
                    <Tabs defaultValue="tuner" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 rounded-sm h-9 px-4 bg-transparent">
                        <TabsTrigger value="tuner" className="rounded-sm text-xs">
                          Tuner
                        </TabsTrigger>
                        <TabsTrigger value="metronome" className="rounded-sm text-xs">
                          Metronome
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="tuner" className="mt-0">
                        <CardContent className="pt-4 px-4 pb-4">
                          <Tuner />
                        </CardContent>
                      </TabsContent>
                      <TabsContent value="metronome" className="mt-0">
                        <CardContent className="pt-4 px-4 pb-4">
                          <Metronome />
                        </CardContent>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-card border-border max-w-2xl rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Song</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-muted-foreground">
                Title
              </Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="bg-secondary border-border text-foreground rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="artist" className="text-muted-foreground">
                Artist
              </Label>
              <Input
                id="artist"
                value={editForm.artist}
                onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
                className="bg-secondary border-border text-foreground rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="key" className="text-muted-foreground">
                Key
              </Label>
              <Input
                id="key"
                value={editForm.key}
                onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
                className="bg-secondary border-border text-foreground rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="tags" className="text-muted-foreground">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                className="bg-secondary border-border text-foreground rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-muted-foreground">
                Content
              </Label>
              <Textarea
                id="content"
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="bg-secondary border-border text-foreground rounded-sm font-mono min-h-[300px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-sm">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="rounded-sm">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function transposeContent(content: string, semitones: number): string {
  if (semitones === 0) return content

  const lines = content.split("\n")
  return lines
    .map((line) => {
      const chordPattern = /\b([A-G][#b]?(?:maj|min|m|sus|add|aug|dim|[0-9])*)\b/g
      return line.replace(chordPattern, (match) => {
        try {
          return transposeChord(match, semitones)
        } catch {
          return match
        }
      })
    })
    .join("\n")
}

function renderLyricsWithChords(content: string) {
  const lines = content.split("\n")
  return lines.map((line, lineIndex) => {
    const chordPattern = /\b([A-G][#b]?(?:maj|min|m|sus|add|aug|dim|[0-9])*)\b/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match

    while ((match = chordPattern.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index))
      }
      parts.push(
        <span
          key={`${lineIndex}-${match.index}`}
          className="bg-primary/10 text-primary font-bold px-1 py-0.5 rounded-sm inline-block my-0.5"
        >
          {match[0]}
        </span>,
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex))
    }

    return (
      <span key={lineIndex} className="block min-h-[1.5em]">
        {parts.length > 0 ? parts : line}
        {"\n"}
      </span>
    )
  })
}

function extractUniqueChords(content: string): string[] {
  const chordPattern = /\b([A-G][#b]?(?:maj|min|m|sus|add|aug|dim|[0-9])*)\b/g
  const chords = new Set<string>()
  let match

  while ((match = chordPattern.exec(content)) !== null) {
    chords.add(match[0])
  }

  return Array.from(chords).sort()
}

function getColumnContent(content: string, columnIndex: number): string {
  const lines = content.split("\n")
  const midpoint = Math.ceil(lines.length / 2)

  if (columnIndex === 0) {
    return lines.slice(0, midpoint).join("\n")
  } else {
    return lines.slice(midpoint).join("\n")
  }
}