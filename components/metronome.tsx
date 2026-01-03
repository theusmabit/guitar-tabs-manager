"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [beatsPerBar, setBeatsPerBar] = useState(4)
  const [currentBeat, setCurrentBeat] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm
      intervalRef.current = setInterval(() => {
        setCurrentBeat((prev) => (prev + 1) % beatsPerBar)
        playClick()
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setCurrentBeat(0)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, bpm, beatsPerBar])

  const playClick = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Higher pitch for first beat
    oscillator.frequency.value = currentBeat === 0 ? 1000 : 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Metronome</h3>
        <p className="text-sm text-muted-foreground">Keep time while practicing</p>
      </div>

      {/* BPM Display */}
      <div className="text-center">
        <div className="text-7xl font-bold text-primary mb-2">{bpm}</div>
        <div className="text-sm text-muted-foreground">BPM</div>
      </div>

      {/* BPM Slider */}
      <div className="space-y-2">
        <Slider value={[bpm]} onValueChange={(v) => setBpm(v[0])} min={40} max={240} step={1} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>40</span>
          <span>140</span>
          <span>240</span>
        </div>
      </div>

      {/* Quick BPM Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[60, 80, 120, 140].map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            className="rounded-sm bg-transparent"
            onClick={() => setBpm(value)}
          >
            {value}
          </Button>
        ))}
      </div>

      {/* Time Signature */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Time Signature</label>
        <Select value={beatsPerBar.toString()} onValueChange={(v) => setBeatsPerBar(Number(v))}>
          <SelectTrigger className="rounded-sm border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-sm border-border">
            <SelectItem value="2">2/4</SelectItem>
            <SelectItem value="3">3/4</SelectItem>
            <SelectItem value="4">4/4</SelectItem>
            <SelectItem value="6">6/8</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Beat Indicators */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: beatsPerBar }).map((_, index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-colors ${
              isPlaying && index === currentBeat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Play/Pause Button */}
      <Button variant={isPlaying ? "default" : "outline"} size="lg" className="w-full rounded-sm" onClick={togglePlay}>
        {isPlaying ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start
          </>
        )}
      </Button>
    </div>
  )
}
