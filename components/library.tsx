"use client"

import { useState, useMemo } from "react"
import { Search, Heart, Trash2, Plus, FolderPlus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Song, Folder } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LibraryProps {
  songs: Song[]
  onViewSong: (song: Song) => void
  onToggleFavorite: (songId: string) => void
  onDeleteSong: (songId: string) => void
  folders: Folder[]
  onAddSongToFolder: (songId: string, folderId: string) => void
  onAddFolder?: () => void
  onDeleteFolder?: (folderId: string) => void
  onSelectFolder?: (folderId: string | null) => void
  selectedFolder?: string | null
  onRemoveSongFromFolder?: (songId: string, folderId: string) => void
  showFolderManager?: boolean
  title: string
}

export function Library({
  songs,
  onViewSong,
  onToggleFavorite,
  onDeleteSong,
  folders,
  onAddSongToFolder,
  onAddFolder,
  onDeleteFolder,
  onSelectFolder,
  selectedFolder,
  onRemoveSongFromFolder,
  showFolderManager,
  title,
}: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  const filteredSongs = useMemo(() => {
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [songs, searchQuery])

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onAddFolder) {
      onAddFolder()
      setNewFolderName("")
      setIsCreatingFolder(false)
    }
  }

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-6">{title}</h2>

        {showFolderManager && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-muted-foreground">Your Folders</h3>
              <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border rounded-sm">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Create New Folder</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Folder name (e.g., Camping Songs)"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                  />
                  <DialogFooter>
                    <Button
                      onClick={handleCreateFolder}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm"
                    >
                      Create Folder
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-sm",
                  !selectedFolder && "bg-primary/10 text-primary border-primary/50 hover:text-primary",
                )}
                onClick={() => onSelectFolder?.(null)}
              >
                All Songs
              </Button>
              {folders.map((folder) => (
                <div key={folder.id} className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-sm",
                      selectedFolder === folder.id && "bg-primary/10 text-primary border-primary/50 hover:text-primary",
                    )}
                    onClick={() => onSelectFolder?.(folder.id)}
                  >
                    {folder.name} ({folder.songIds.length})
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm"
                    onClick={() => onDeleteFolder?.(folder.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-sm h-11"
          />
        </div>
      </div>

      {filteredSongs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MusicIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No songs found</p>
          <p className="text-sm">Try adjusting your search or add some songs</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <Card
              key={song.id}
              className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group rounded-sm shadow-sm hover:shadow-md"
            >
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0" onClick={() => onViewSong(song)}>
                    <CardTitle className="text-foreground text-lg mb-1 truncate">{song.title}</CardTitle>
                    <p className="text-muted-foreground text-sm truncate">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-sm",
                        song.isFavorite
                          ? "text-primary hover:text-primary/80"
                          : "text-muted-foreground hover:text-primary",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(song.id)
                      }}
                    >
                      <Heart className={cn("w-4 h-4", song.isFavorite && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5" onClick={() => onViewSong(song)}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs rounded-sm">
                      Key: {song.key}
                    </Badge>
                    {song.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-border text-muted-foreground text-xs rounded-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {showFolderManager && selectedFolder && onRemoveSongFromFolder && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary rounded-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveSongFromFolder(song.id, selectedFolder)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary rounded-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FolderPlus className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border rounded-sm">
                        {folders.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">No folders yet</div>
                        ) : (
                          folders.map((folder) => (
                            <DropdownMenuItem
                              key={folder.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                onAddSongToFolder(song.id, folder.id)
                              }}
                              className="text-foreground hover:bg-accent focus:bg-accent cursor-pointer"
                            >
                              {folder.name}
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("Are you sure you want to delete this song?")) {
                          onDeleteSong(song.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  )
}