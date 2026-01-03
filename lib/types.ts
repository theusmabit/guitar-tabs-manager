export interface Song {
  id: string
  title: string
  artist: string
  content: string
  key: string
  isFavorite: boolean
  tags: string[]
  createdAt: string // ISO date string
}

export interface Folder {
  id: string
  name: string
  songIds: string[]
}