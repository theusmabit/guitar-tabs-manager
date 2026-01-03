"use client"

import type React from "react"
import { useState } from "react"
import { Plus, FileJson, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Song } from "@/lib/types"

interface AddSongProps {
  onAddSong: (song: Song) => void
  onImportSongs: (songs: Song[]) => void
}

export function AddSong({ onAddSong, onImportSongs }: AddSongProps) {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    key: "C",
    content: "",
    tags: "",
  })
  const [jsonImport, setJsonImport] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSong: Song = {
      id: crypto.randomUUID(),
      title: form.title,
      artist: form.artist,
      key: form.key,
      content: form.content,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }
    onAddSong(newSong)

    // Reset form
    setForm({
      title: "",
      artist: "",
      key: "C",
      content: "",
      tags: "",
    })
  }

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonImport)
      const songs: Song[] = Array.isArray(parsed) ? parsed : [parsed]
      const now = new Date().toISOString()

      // Validate and add IDs/Dates if missing
      const validatedSongs = songs.map((song) => ({
        id: song.id || crypto.randomUUID(),
        title: song.title || "Untitled",
        artist: song.artist || "Unknown",
        key: song.key || "C",
        content: song.content || "",
        isFavorite: song.isFavorite || false,
        createdAt: song.createdAt || now,
        tags: song.tags || [],
      }))

      onImportSongs(validatedSongs)
      setJsonImport("")
      alert(`Successfully imported ${validatedSongs.length} song(s)!`)
    } catch (error) {
      alert("Invalid JSON format. Please check your input.")
    }
  }

  const handleFileImport = (file: File) => {
    const reader = new FileReader()
    const now = new Date().toISOString()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)
        const songs: Song[] = Array.isArray(parsed) ? parsed : [parsed]

        // Validate and add IDs/Dates if missing
        const validatedSongs = songs.map((song) => ({
          id: song.id || crypto.randomUUID(),
          title: song.title || "Untitled",
          artist: song.artist || "Unknown",
          key: song.key || "C",
          content: song.content || "",
          isFavorite: song.isFavorite || false,
          createdAt: song.createdAt || now,
          tags: song.tags || [],
        }))

        onImportSongs(validatedSongs)
        alert(`Successfully imported ${validatedSongs.length} song(s) from file!`)
      } catch (error) {
        alert("Invalid JSON file format. Please check your file.")
      }
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileImport(file)
      // Reset input to allow selecting the same file again
      e.target.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "application/json") {
      handleFileImport(file)
    } else {
      alert("Please drop a valid JSON file.")
    }
  }

  return (
    <div className="p-6 pt-20 md:pt-20 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-6">Add New Song</h2>
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" /> Manual Entry
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileJson className="w-4 h-4 mr-2" /> JSON Import
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Song Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-muted-foreground">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Song title"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="artist" className="text-muted-foreground">
                    Artist *
                  </Label>
                  <Input
                    id="artist"
                    required
                    value={form.artist}
                    onChange={(e) => setForm({ ...form, artist: e.target.value })}
                    placeholder="Artist name"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="key" className="text-muted-foreground">
                    Key
                  </Label>
                  <Input
                    id="key"
                    value={form.key}
                    onChange={(e) => setForm({ ...form, key: e.target.value })}
                    placeholder="C, G, Am, etc."
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="tags" className="text-muted-foreground">
                    Tags (comma-separated)
                  </Label>
                  <Input
                    id="tags"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="Rock, Classic, Acoustic"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-muted-foreground">
                    Content (Lyrics & Chords) *
                  </Label>
                  <Textarea
                    id="content"
                    required
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Enter lyrics with chords above the words..."
                    className="bg-secondary border-border text-foreground font-mono min-h-[400px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Tip: Place chords on a separate line above the lyrics for proper alignment
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Song
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="json">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Bulk Import from JSON</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  {isDragging ? "Drop JSON file here" : "Drag & drop JSON file here"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <Button variant="outline" className="border-border text-muted-foreground hover:bg-accent">
                  <FileJson className="w-4 h-4 mr-2" /> Select JSON File
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or paste JSON</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="json" className="text-muted-foreground">
                  Paste JSON (Array of songs or single song)
                </Label>
                <Textarea
                  id="json"
                  value={jsonImport}
                  onChange={(e) => setJsonImport(e.target.value)}
                  placeholder='[{"title": "Song Name", "artist": "Artist", "key": "C", "content": "Lyrics...", "tags": ["Rock"]}]'
                  className="bg-secondary border-border text-foreground font-mono min-h-[300px]"
                />
              </div>
              <div className="bg-secondary p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Expected JSON structure:</p>
                <pre className="text-xs text-muted-foreground opacity-70 overflow-x-auto">
                  {`{
  "title": "Song Title",
  "artist": "Artist Name",
  "key": "C",
  "content": "Lyrics with chords...",
  "tags": ["Rock", "Classic"]
}`}
                </pre>
              </div>
              <Button
                onClick={handleJsonImport}
                disabled={!jsonImport.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <FileJson className="w-4 h-4 mr-2" /> Import Songs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}