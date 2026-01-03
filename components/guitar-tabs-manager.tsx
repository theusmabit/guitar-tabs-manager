"use client"

import { useState, useEffect, useMemo } from "react"
import { Library } from "./library"
import { SongViewer } from "./song-viewer"
import { AddSong } from "./add-song"
import { Sidebar } from "./sidebar"
import { MobileSidebar } from "./mobile-sidebar"
import { SettingsView } from "./settings-view"
import { Homepage } from "./homepage"
import { TopBar } from "./top-bar"
import type { Song, Folder } from "@/lib/types"
import { getMockSongs, saveSongs, loadSongs, saveFolders, loadFolders } from "@/lib/storage"

export function GuitarTabsManager() {
  const [songs, setSongs] = useState<Song[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentView, setCurrentView] = useState<
    "home" | "library" | "favorites" | "folders" | "add" | "settings" | "song"
  >("home")
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadedSongs = loadSongs()
    const loadedFolders = loadFolders()

    if (loadedSongs.length === 0) {
      const mockSongs = getMockSongs()
      setSongs(mockSongs)
      saveSongs(mockSongs)
    } else {
      setSongs(loadedSongs)
    }

    setFolders(loadedFolders)
  }, [])

  useEffect(() => {
    if (songs.length > 0) {
      saveSongs(songs)
    }
  }, [songs])

  useEffect(() => {
    if (folders.length > 0) {
      saveFolders(folders)
    }
  }, [folders])

  const handleAddSong = (song: Song) => {
    setSongs([...songs, song])
    setCurrentView("library")
  }

  const handleToggleFavorite = (songId: string) => {
    setSongs(songs.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s)))
    if (selectedSong?.id === songId) {
      setSelectedSong({ ...selectedSong, isFavorite: !selectedSong.isFavorite })
    }
  }

  const handleDeleteSong = (songId: string) => {
    setSongs(songs.filter((s) => s.id !== songId))
    if (selectedSong?.id === songId) {
      setSelectedSong(null)
      setCurrentView("library")
    }
  }

  const handleUpdateSong = (updatedSong: Song) => {
    setSongs(songs.map((s) => (s.id === updatedSong.id ? updatedSong : s)))
    setSelectedSong(updatedSong)
  }

  const handleViewSong = (song: Song) => {
    setSelectedSong(song)
    setCurrentView("song")
  }

  const handleAddFolder = (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      songIds: [],
    }
    setFolders([...folders, newFolder])
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter((f) => f.id !== folderId))
    if (selectedFolder === folderId) {
      setSelectedFolder(null)
    }
  }

  const handleAddSongToFolder = (songId: string, folderId: string) => {
    setFolders(folders.map((f) => (f.id === folderId ? { ...f, songIds: [...f.songIds, songId] } : f)))
  }

  const handleRemoveSongFromFolder = (songId: string, folderId: string) => {
    setFolders(folders.map((f) => (f.id === folderId ? { ...f, songIds: f.songIds.filter((id) => id !== songId) } : f)))
  }

  const handleImportSongs = (importedSongs: Song[]) => {
    setSongs([...songs, ...importedSongs])
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setCurrentView("library")
    }
  }

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs
    const query = searchQuery.toLowerCase()
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        s.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [songs, searchQuery])

  const favoriteSongs = useMemo(() => songs.filter((s) => s.isFavorite), [songs])

  const folderSongs = useMemo(() => {
    if (!selectedFolder) return []
    const folder = folders.find((f) => f.id === selectedFolder)
    if (!folder) return []
    return songs.filter((s) => folder.songIds.includes(s.id))
  }, [selectedFolder, folders, songs])

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <Homepage
            songs={songs}
            favoriteSongs={favoriteSongs}
            folders={folders}
            onViewSong={handleViewSong}
            onNavigate={setCurrentView}
          />
        )
      case "library":
        return (
          <Library
            songs={searchQuery ? filteredSongs : songs}
            onViewSong={handleViewSong}
            onToggleFavorite={handleToggleFavorite}
            onDeleteSong={handleDeleteSong}
            folders={folders}
            onAddSongToFolder={handleAddSongToFolder}
            title={searchQuery ? `Search Results for "${searchQuery}"` : "All Songs"}
          />
        )
      case "favorites":
        return (
          <Library
            songs={favoriteSongs}
            onViewSong={handleViewSong}
            onToggleFavorite={handleToggleFavorite}
            onDeleteSong={handleDeleteSong}
            folders={folders}
            onAddSongToFolder={handleAddSongToFolder}
            title="Favorite Songs"
          />
        )
      case "folders":
        return (
          <Library
            songs={selectedFolder ? folderSongs : []}
            onViewSong={handleViewSong}
            onToggleFavorite={handleToggleFavorite}
            onDeleteSong={handleDeleteSong}
            folders={folders}
            onAddSongToFolder={handleAddSongToFolder}
            onAddFolder={handleAddFolder}
            onDeleteFolder={handleDeleteFolder}
            onSelectFolder={setSelectedFolder}
            selectedFolder={selectedFolder}
            onRemoveSongFromFolder={handleRemoveSongFromFolder}
            showFolderManager
            title="Folders"
          />
        )
      case "add":
        return <AddSong onAddSong={handleAddSong} onImportSongs={handleImportSongs} />
      case "song":
        return selectedSong ? (
          <SongViewer
            song={selectedSong}
            onToggleFavorite={handleToggleFavorite}
            onUpdateSong={handleUpdateSong}
            onBack={() => setCurrentView("library")}
          />
        ) : null
      case "settings":
        return <SettingsView songs={songs} folders={folders} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <TopBar onSearch={handleSearch} onNavigateHome={() => setCurrentView("home")} />
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <MobileSidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-auto pt-16">{renderContent()}</main>
    </div>
  )
}
