"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const chromaticNotes = [
  { name: "C", frequency: 261.63 },
  { name: "C#", frequency: 277.18 },
  { name: "D", frequency: 293.66 },
  { name: "D#", frequency: 311.13 },
  { name: "E", frequency: 329.63 },
  { name: "F", frequency: 349.23 },
  { name: "F#", frequency: 369.99 },
  { name: "G", frequency: 392.0 },
  { name: "G#", frequency: 415.3 },
  { name: "A", frequency: 440.0 },
  { name: "A#", frequency: 466.16 },
  { name: "B", frequency: 493.88 },
]

export function Tuner() {
  const [isListening, setIsListening] = useState(false)
  const [detectedNote, setDetectedNote] = useState<string>("")
  const [cents, setCents] = useState<number>(0)
  const [selectedNote, setSelectedNote] = useState<number>(9) // Default to A440

  const playReferenceNote = (frequency: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 1.5)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate tuner detection (in real app, would use Web Audio API)
      const interval = setInterval(() => {
        const randomNote = chromaticNotes[Math.floor(Math.random() * chromaticNotes.length)].name
        const randomCents = Math.floor(Math.random() * 40) - 20
        setDetectedNote(randomNote)
        setCents(randomCents)
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setDetectedNote("")
      setCents(0)
    }
  }

  const getTuningIndicator = () => {
    if (Math.abs(cents) < 5) return "In Tune"
    if (cents > 0) return `${cents} cents sharp`
    return `${Math.abs(cents)} cents flat`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-foreground mb-2">Chromatic Tuner</h3>
        <p className="text-xs text-muted-foreground">Tap a note to hear reference pitch or use microphone</p>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {chromaticNotes.map((note, index) => (
          <Button
            key={index}
            variant={selectedNote === index ? "default" : "outline"}
            className="h-16 flex flex-col items-center justify-center rounded-sm border-border text-xs"
            onClick={() => {
              setSelectedNote(index)
              playReferenceNote(note.frequency)
            }}
          >
            <span className="text-lg font-bold">{note.name}</span>
            <span className="text-[10px] text-muted-foreground">{note.frequency.toFixed(0)}Hz</span>
          </Button>
        ))}
      </div>

      {/* Microphone Button */}
      <Button
        variant={isListening ? "default" : "outline"}
        className="w-full h-10 rounded-sm text-sm"
        onClick={toggleListening}
      >
        {isListening ? "Stop Listening" : "Start Tuning"}
      </Button>

      {/* Detection Display */}
      {isListening && detectedNote && (
        <div className="bg-card border border-border rounded-sm p-6 text-center space-y-4">
          <div className="text-5xl font-bold text-primary">{detectedNote}</div>

          {/* Tuning Meter */}
          <div className="relative h-8 bg-secondary rounded-full overflow-hidden">
            <div className="absolute top-0 left-1/2 w-1 h-full bg-foreground transform -translate-x-1/2 z-10" />
            <div
              className="absolute top-0 h-full w-2 bg-primary transition-all duration-300 rounded-full"
              style={{
                left: `calc(50% + ${cents}%)`,
                transform: "translateX(-50%)",
              }}
            />
          </div>

          <Badge variant={Math.abs(cents) < 5 ? "default" : "outline"} className="text-sm">
            {getTuningIndicator()}
          </Badge>
        </div>
      )}
    </div>
  )
}
