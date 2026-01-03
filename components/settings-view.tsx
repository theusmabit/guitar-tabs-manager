"use client"

import { Download, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Song, Folder } from "@/lib/types"

interface SettingsViewProps {
  songs: Song[]
  folders: Folder[]
}

export function SettingsView({ songs, folders }: SettingsViewProps) {
  const handleExportData = () => {
    const data = {
      songs,
      folders,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `guitar-tabs-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          localStorage.setItem("guitar-tabs-songs", JSON.stringify(data.songs || []))
          localStorage.setItem("guitar-tabs-folders", JSON.stringify(data.folders || []))
          alert("Data imported successfully! Please refresh the page.")
        } catch (error) {
          alert("Failed to import data. Invalid file format.")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all songs and folders? This cannot be undone.")) {
      localStorage.removeItem("guitar-tabs-songs")
      localStorage.removeItem("guitar-tabs-folders")
      alert("All data cleared! Please refresh the page.")
    }
  }

  return (
    <div className="p-6 pt-20 md:pt-20 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-6">Settings</h2>

      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Data Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Export, import, or clear your library data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleExportData}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Library (JSON)
            </Button>
            <Button
              onClick={handleImportData}
              variant="outline"
              className="w-full border-border text-muted-foreground hover:bg-accent justify-start bg-transparent"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Library
            </Button>
            <Button
              onClick={handleClearData}
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10 justify-start bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Library Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>Total Songs:</span>
              <span className="font-semibold text-primary">{songs.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Favorites:</span>
              <span className="font-semibold text-primary">{songs.filter((s) => s.isFavorite).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Folders:</span>
              <span className="font-semibold text-primary">{folders.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
