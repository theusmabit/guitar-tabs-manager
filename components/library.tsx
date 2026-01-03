"use client"

import { useState, useMemo } from "react"
import { Search, Heart, Trash2, Plus, FolderPlus, X, Filter, List, Grid3X3, Music, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Song, Folder } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from "@/components/ui/context-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

type SortOption = "title-asc" | "title-desc" | "artist-asc" | "artist-desc" | "newest" | "oldest"

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
  const [sortOrder, setSortOrder] = useState<SortOption>("newest")
  const [filters, setFilters] = useState({
    genre: "",
    artist: "",
    key: "",
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [suggestions, setSuggestions] = useState({
    genres: [] as string[],
    artists: [] as string[],
  })
  const [showSuggestions, setShowSuggestions] = useState({
    genre: false,
    artist: false,
  })

  // Extrair opções únicas para os filtros
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>()
    songs.forEach(song => {
      song.tags.forEach(tag => genres.add(tag))
    })
    return Array.from(genres).sort()
  }, [songs])

  const uniqueArtists = useMemo(() => {
    const artists = new Set<string>()
    songs.forEach(song => artists.add(song.artist))
    return Array.from(artists).sort()
  }, [songs])

  const uniqueKeys = useMemo(() => {
    const keys = new Set<string>()
    songs.forEach(song => keys.add(song.key))
    return Array.from(keys).sort()
  }, [songs])

  // Atualizar sugestões com base no input do usuário
  const updateSuggestions = (type: "genre" | "artist", value: string) => {
    if (value === "") {
      setSuggestions(prev => ({ ...prev, [type]: [] }))
      return
    }
    
    if (type === "genre") {
      const filtered = uniqueGenres.filter(g => 
        g.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setSuggestions(prev => ({ ...prev, genres: filtered }))
    } else {
      const filtered = uniqueArtists.filter(a => 
        a.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setSuggestions(prev => ({ ...prev, artists: filtered }))
    }
  }

  const processedSongs = useMemo(() => {
    let result = songs.filter((song) => {
      const matchesSearch = 
        searchQuery === "" || 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesGenre = 
        filters.genre === "" || 
        song.tags.some(tag => tag.toLowerCase().includes(filters.genre.toLowerCase()))
      
      const matchesArtist = 
        filters.artist === "" || 
        song.artist.toLowerCase().includes(filters.artist.toLowerCase())
      
      const matchesKey = 
        filters.key === "" || 
        song.key === filters.key
      
      return matchesSearch && matchesGenre && matchesArtist && matchesKey
    })

    // Ordenação
    return result.sort((a, b) => {
      switch (sortOrder) {
        case "title-asc": return a.title.localeCompare(b.title)
        case "title-desc": return b.title.localeCompare(a.title)
        case "artist-asc": return a.artist.localeCompare(b.artist)
        case "artist-desc": return b.artist.localeCompare(a.artist)
        case "newest": return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case "oldest": return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        default: return 0
      }
    })
  }, [songs, searchQuery, filters, sortOrder])

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onAddFolder) {
      onAddFolder()
      setNewFolderName("")
      setIsCreatingFolder(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      genre: "",
      artist: "",
      key: "",
    })
    setSearchQuery("")
    setSortOrder("newest")
  }

  const handleGenreSelect = (genre: string) => {
    setFilters(prev => ({ ...prev, genre }))
    setShowSuggestions({ genre: false, artist: false })
  }

  const handleArtistSelect = (artist: string) => {
    setFilters(prev => ({ ...prev, artist }))
    setShowSuggestions({ genre: false, artist: false })
  }

  return (
    <div className="p-6 pt-20 md:pt-20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
        
        {showFolderManager && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-muted-foreground">Your Folders</h3>
              <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" /> New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Create New Folder</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Folder name (e.g., Camping Songs)"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                  />
                  <DialogFooter>
                    <Button
                      onClick={handleCreateFolder}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
                  "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                  !selectedFolder && "bg-primary/10 text-primary border-primary/50 hover:text-primary"
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
                      "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                      selectedFolder === folder.id && "bg-primary/10 text-primary border-primary/50 hover:text-primary"
                    )}
                    onClick={() => onSelectFolder?.(folder.id)}
                  >
                    {folder.name} ({folder.songIds.length})
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeleteFolder?.(folder.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={sortOrder} onValueChange={(v: SortOption) => setSortOrder(v)}>
                <SelectTrigger className="w-[180px] bg-secondary border-border h-9 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="title-asc">Título (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Título (Z-A)</SelectItem>
                  <SelectItem value="artist-asc">Artista (A-Z)</SelectItem>
                  <SelectItem value="artist-desc">Artista (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={clearFilters}
              className="border-border text-muted-foreground hover:bg-accent"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="border-border text-muted-foreground hover:bg-accent"
            >
              {viewMode === "grid" ? (
                <>
                  <List className="w-4 h-4 mr-2" />
                  List View
                </>
              ) : (
                <>
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid View
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Genre Filter with Suggestions */}
          <div className="relative">
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Genre</label>
            <Input
              placeholder="Filter by genre..."
              value={filters.genre}
              onChange={(e) => {
                const value = e.target.value
                setFilters(prev => ({ ...prev, genre: value }))
                updateSuggestions("genre", value)
                setShowSuggestions(prev => ({ ...prev, genre: value.length > 0 }))
              }}
              onFocus={() => setShowSuggestions(prev => ({ ...prev, genre: filters.genre.length > 0 }))}
              onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, genre: false })), 200)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            {showSuggestions.genre && suggestions.genres.length > 0 && (
              <Card className="absolute z-10 w-full mt-1 bg-card border-border shadow-lg">
                <CardContent className="p-2">
                  {suggestions.genres.map((genre) => (
                    <Button
                      key={genre}
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:bg-accent"
                      onClick={() => handleGenreSelect(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Artist Filter with Suggestions */}
          <div className="relative">
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Artist</label>
            <Input
              placeholder="Filter by artist..."
              value={filters.artist}
              onChange={(e) => {
                const value = e.target.value
                setFilters(prev => ({ ...prev, artist: value }))
                updateSuggestions("artist", value)
                setShowSuggestions(prev => ({ ...prev, artist: value.length > 0 }))
              }}
              onFocus={() => setShowSuggestions(prev => ({ ...prev, artist: filters.artist.length > 0 }))}
              onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, artist: false })), 200)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            {showSuggestions.artist && suggestions.artists.length > 0 && (
              <Card className="absolute z-10 w-full mt-1 bg-card border-border shadow-lg">
                <CardContent className="p-2">
                  {suggestions.artists.map((artist) => (
                    <Button
                      key={artist}
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:bg-accent"
                      onClick={() => handleArtistSelect(artist)}
                    >
                      {artist}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Key Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Key</label>
            <select
              value={filters.key}
              onChange={(e) => setFilters(prev => ({ ...prev, key: e.target.value }))}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All keys</option>
              {uniqueKeys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {processedSongs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No songs found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedSongs.map((song) => (
            <Card
              key={song.id}
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <CardHeader className="pb-3">
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
                        "h-8 w-8",
                        song.isFavorite ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-primary"
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
              <CardContent onClick={() => onViewSong(song)}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                      Key: {song.key}
                    </Badge>
                    {song.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-border text-muted-foreground text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {showFolderManager && selectedFolder && onRemoveSongFromFolder && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
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
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FolderPlus className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border">
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
                              className="text-foreground hover:bg-accent focus:bg-accent"
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
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
      ) : (
        // List View
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {processedSongs.map((song) => (
                <ContextMenu key={song.id}>
                  <ContextMenuTrigger>
                    <div 
                      className="flex items-center p-4 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => onViewSong(song)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary flex items-center justify-center rounded-md w-10 h-10 flex-shrink-0">
                            <Music className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-foreground truncate">{song.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                            {song.key}
                          </Badge>
                          {song.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="border-border text-muted-foreground text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {song.tags.length > 2 && (
                            <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                              +{song.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8",
                            song.isFavorite ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-primary"
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
                  </ContextMenuTrigger>
                  
                  <ContextMenuContent className="bg-card border-border">
                    <ContextMenuItem onClick={() => onViewSong(song)}>
                      View Details
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => onToggleFavorite(song.id)}>
                      {song.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => {
                      if (confirm("Are you sure you want to delete this song?")) {
                        onDeleteSong(song.id)
                      }
                    }} className="text-destructive focus:text-destructive">
                      Delete Song
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}