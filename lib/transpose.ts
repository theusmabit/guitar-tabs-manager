const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
}

export function transposeChord(chord: string, semitones: number): string {
  // Extract the root note and the rest of the chord
  const match = chord.match(/^([A-G][#b]?)(.*)?$/)
  if (!match) return chord

  let [, root, suffix = ""] = match

  // Convert flats to sharps
  if (root in FLAT_TO_SHARP) {
    root = FLAT_TO_SHARP[root]
  }

  // Find the index of the root note
  const index = NOTES.indexOf(root)
  if (index === -1) return chord

  // Calculate new index
  let newIndex = (index + semitones) % 12
  if (newIndex < 0) newIndex += 12

  // Return transposed chord
  return NOTES[newIndex] + suffix
}
