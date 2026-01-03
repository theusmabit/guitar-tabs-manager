"use client"

import { useState, useRef, useEffect } from "react"
import { SkipBack, SkipForward, Volume2, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Song } from "@/lib/types"

interface MusicPlayerProps {
  song: Song
  audioUrl?: string
}

export function MusicPlayer({ song, audioUrl }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-[#2a3441] rounded-lg p-6 mb-6 shadow-lg">
      <audio ref={audioRef} src={audioUrl || `/placeholder-audio.mp3`} />

      <div className="space-y-4">
        {/* Song Title and Time */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{song.title}</h3>
          <div className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Progress Bar */}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
        />

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-transparent"
              disabled={!audioUrl}
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-transparent"
              disabled={!audioUrl}
            >
              <Shuffle className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-transparent"
              disabled={!audioUrl}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-32">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
            />
          </div>
        </div>

        {!audioUrl && (
          <p className="text-xs text-center text-gray-500 italic mt-2">No audio file available for this song</p>
        )}
      </div>
    </div>
  )
}
