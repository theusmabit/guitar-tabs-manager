import type { Song, Folder } from "./types"

const SONGS_KEY = "guitar-tabs-songs"
const FOLDERS_KEY = "guitar-tabs-folders"

export function saveSongs(songs: Song[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SONGS_KEY, JSON.stringify(songs))
  }
}

export function loadSongs(): Song[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(SONGS_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveFolders(folders: Folder[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
  }
}

export function loadFolders(): Folder[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(FOLDERS_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function getMockSongs(): Song[] {
  const now = new Date().toISOString()
  return [
    {
      id: "1",
      title: "Que País É Este",
      artist: "Legião Urbana",
      key: "D",
      isFavorite: false,
      tags: ["Rock", "Classic"],
      createdAt: now,
      content: `       D                G
Nas favelas, no senado
D                      G
Sujeira pra todo lado
D                    G
Ninguém respeita a constituição
     D                    G
Mas todos acreditam no futuro da nação

     A              G
Que país é este?
     A              G
Que país é este?
     A              G
Que país é este?

       D                    G
No Amazonas, na Araguaia, iá, iá
D                 G
Na Baixada Fluminense
D                          G
Mato Grosso, Minas Gerais, e no
D                      G
Nordeste tudo em paz

     A              G
Que país é este?
     A              G
Que país é este?
     A              G
Que país é este?`,
    },
    {
      id: "2",
      title: "Faroeste Caboclo",
      artist: "Legião Urbana",
      key: "Bm",
      isFavorite: true,
      tags: ["Rock", "Epic"],
      createdAt: now,
      content: `Bm                        A
Não tinha medo o tal João de Santo Cristo
Bm                           A
Era o que todos diziam quando ele se perdeu
Bm                        A
Deixou pra trás todo o marasmo da fazenda
   G                    A
Só pra sentir no seu sangue o ódio que Jesus lhe deu

Bm                    A
Quando criança só pensava em ser bandido
Bm                        A
Ainda mais quando assistia Fleig lutando no sertão
Bm                          A
Ele ficava ali paradão, deslumbrado
    G                      A
Mas inconformado com a maldade e a opressão`,
    },
    {
      id: "3",
      title: "Anunciação",
      artist: "Alceu Valença",
      key: "Am",
      isFavorite: false,
      tags: ["MPB", "Forró"],
      createdAt: now,
      content: `      Am
Tu vens, tu vens
      Dm
Eu já escuto os teus sinais
      Am
Tu vens, tu vens
      E7
Eu já escuto os teus sinais

       Am                    Dm
Que tu vens da outra vida da estrela d'alva
       Am                    E7
Que tu vens da outra vida da estrela d'alva

      Am
Tu vens, tu vens
      Dm
Eu já escuto os teus sinais
      Am
Tu vens, tu vens
      E7
Eu já escuto os teus sinais`,
    },
    {
      id: "4",
      title: "Eduardo e Mônica",
      artist: "Legião Urbana",
      key: "G",
      isFavorite: true,
      tags: ["Rock", "Romance"],
      createdAt: now,
      content: `G                    Em
Quem um dia irá dizer
              C                D
Que existe razão nas coisas feitas pelo coração?
  G                 Em
E quem irá dizer
              C                D
Que não existe razão?

G              Em
Eduardo abriu os olhos mas não quis se levantar
C                                D
Ficou deitado e viu que horas eram
G              Em
Enquanto Mônica tomava um conhaque
      C                        D
No outro canto da cidade, como eles disseram

G                Em
Eduardo e Mônica um dia se encontraram sem querer
C                        D
E conversaram muito mesmo pra tentar se conhecer
    G                  Em
Foi um carinha do cursinho do Eduardo que disse
       C                      D
"Tem uma festa legal, e a gente quer se divertir"`,
    },
    {
      id: "5",
      title: "Tempo Perdido",
      artist: "Legião Urbana",
      key: "E",
      isFavorite: false,
      tags: ["Rock", "Classic"],
      createdAt: now,
      content: `E                           B
Todos os dias quando acordo
A                        E
Não tenho mais o tempo que passou
E                           B
Mas tenho muito tempo
A                    E
Temos todo o tempo do mundo

E  B  A  E

E                           B
Todos os dias antes de dormir
A                        E
Lembro e esqueço como foi o dia
E                           B
Sempre em frente
A                    E
Não temos tempo a perder

E               B
Nosso suor sagrado
A                   E
É bem mais belo que esse sangue amargo
E                B
E tão sério e selvagem
A  E
Selvagem`,
    },
  ]
}