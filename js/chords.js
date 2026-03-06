const CHORD_DIAGRAMS = {
    // Major Chords
    'C': {
        frets: [0, 1, 0, 2, 3, -1],
        diagram: `
  C Major
e |---0---
B |---1---
G |---0---
D |---2---
A |---3---
E |---X---`
    },
    'D': {
        frets: [2, 3, 2, 0, -1, -1],
        diagram: `
  D Major
e |---2---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'E': {
        frets: [0, 0, 1, 2, 2, 0],
        diagram: `
  E Major
e |---0---
B |---0---
G |---1---
D |---2---
A |---2---
E |---0---`
    },
    'F': {
        frets: [1, 1, 2, 3, 3, 1],
        diagram: `
  F Major (Barre)
e |---1---
B |---1---
G |---2---
D |---3---
A |---3---
E |---1---`
    },
    'G': {
        frets: [3, 0, 0, 0, 2, 3],
        diagram: `
  G Major
e |---3---
B |---0---
G |---0---
D |---0---
A |---2---
E |---3---`
    },
    'A': {
        frets: [0, 2, 2, 2, 0, -1],
        diagram: `
  A Major
e |---0---
B |---2---
G |---2---
D |---2---
A |---0---
E |---X---`
    },
    'B': {
        frets: [2, 4, 4, 4, 2, -1],
        diagram: `
  B Major (Barre)
e |---2---
B |---4---
G |---4---
D |---4---
A |---2---
E |---X---`
    },
    
    // Minor Chords
    'Am': {
        frets: [0, 1, 2, 2, 0, -1],
        diagram: `
  A minor
e |---0---
B |---1---
G |---2---
D |---2---
A |---0---
E |---X---`
    },
    'Bm': {
        frets: [2, 3, 4, 4, 2, -1],
        diagram: `
  B minor (Barre)
e |---2---
B |---3---
G |---4---
D |---4---
A |---2---
E |---X---`
    },
    'Cm': {
        frets: [3, 4, 5, 5, 3, -1],
        diagram: `
  C minor (Barre)
e |---3---
B |---4---
G |---5---
D |---5---
A |---3---
E |---X---`
    },
    'Dm': {
        frets: [1, 3, 2, 0, -1, -1],
        diagram: `
  D minor
e |---1---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'Em': {
        frets: [0, 0, 0, 2, 2, 0],
        diagram: `
  E minor
e |---0---
B |---0---
G |---0---
D |---2---
A |---2---
E |---0---`
    },
    'Fm': {
        frets: [1, 1, 1, 3, 4, 1],
        diagram: `
  F minor (Barre)
e |---1---
B |---1---
G |---1---
D |---3---
A |---4---
E |---1---`
    },
    'Gm': {
        frets: [3, 3, 3, 5, 6, 3],
        diagram: `
  G minor (Barre)
e |---3---
B |---3---
G |---3---
D |---5---
A |---6---
E |---3---`
    },
    
    // 7th Chords
    'C7': {
        frets: [0, 1, 3, 2, 3, -1],
        diagram: `
  C7
e |---0---
B |---1---
G |---3---
D |---2---
A |---3---
E |---X---`
    },
    'D7': {
        frets: [2, 1, 2, 0, -1, -1],
        diagram: `
  D7
e |---2---
B |---1---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'E7': {
        frets: [0, 0, 1, 0, 2, 0],
        diagram: `
  E7
e |---0---
B |---0---
G |---1---
D |---0---
A |---2---
E |---0---`
    },
    'F7': {
        frets: [1, 1, 2, 1, 3, 1],
        diagram: `
  F7 (Barre)
e |---1---
B |---1---
G |---2---
D |---1---
A |---3---
E |---1---`
    },
    'G7': {
        frets: [1, 0, 0, 0, 2, 3],
        diagram: `
  G7
e |---1---
B |---0---
G |---0---
D |---0---
A |---2---
E |---3---`
    },
    'A7': {
        frets: [0, 2, 0, 2, 0, -1],
        diagram: `
  A7
e |---0---
B |---2---
G |---0---
D |---2---
A |---0---
E |---X---`
    },
    'B7': {
        frets: [2, 0, 2, 1, 2, -1],
        diagram: `
  B7
e |---2---
B |---0---
G |---2---
D |---1---
A |---2---
E |---X---`
    },
    
    // Major 7th Chords
    'Cmaj7': {
        frets: [0, 0, 0, 2, 3, -1],
        diagram: `
  Cmaj7
e |---0---
B |---0---
G |---0---
D |---2---
A |---3---
E |---X---`
    },
    'Dmaj7': {
        frets: [2, 2, 2, 0, -1, -1],
        diagram: `
  Dmaj7
e |---2---
B |---2---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'Emaj7': {
        frets: [0, 0, 1, 1, 2, 0],
        diagram: `
  Emaj7
e |---0---
B |---0---
G |---1---
D |---1---
A |---2---
E |---0---`
    },
    'Fmaj7': {
        frets: [1, 1, 2, 2, 3, 1],
        diagram: `
  Fmaj7 (Barre)
e |---1---
B |---1---
G |---2---
D |---2---
A |---3---
E |---1---`
    },
    'Gmaj7': {
        frets: [2, 0, 0, 0, 2, 3],
        diagram: `
  Gmaj7
e |---2---
B |---0---
G |---0---
D |---0---
A |---2---
E |---3---`
    },
    'Amaj7': {
        frets: [0, 2, 1, 2, 0, -1],
        diagram: `
  Amaj7
e |---0---
B |---2---
G |---1---
D |---2---
A |---0---
E |---X---`
    },
    'Bmaj7': {
        frets: [2, 4, 3, 4, 2, -1],
        diagram: `
  Bmaj7 (Barre)
e |---2---
B |---4---
G |---3---
D |---4---
A |---2---
E |---X---`
    },
    
    // Minor 7th Chords
    'Cm7': {
        frets: [3, 1, 3, 1, 3, -1],
        diagram: `
  Cm7 (Barre)
e |---3---
B |---1---
G |---3---
D |---1---
A |---3---
E |---X---`
    },
    'Dm7': {
        frets: [1, 1, 2, 0, -1, -1],
        diagram: `
  Dm7
e |---1---
B |---1---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'Em7': {
        frets: [0, 0, 0, 0, 2, 0],
        diagram: `
  Em7
e |---0---
B |---0---
G |---0---
D |---0---
A |---2---
E |---0---`
    },
    'Fm7': {
        frets: [1, 1, 1, 1, 4, 1],
        diagram: `
  Fm7 (Barre)
e |---1---
B |---1---
G |---1---
D |---1---
A |---4---
E |---1---`
    },
    'Gm7': {
        frets: [3, 3, 3, 3, 6, 3],
        diagram: `
  Gm7 (Barre)
e |---3---
B |---3---
G |---3---
D |---3---
A |---6---
E |---3---`
    },
    'Am7': {
        frets: [0, 1, 0, 2, 0, -1],
        diagram: `
  Am7
e |---0---
B |---1---
G |---0---
D |---2---
A |---0---
E |---X---`
    },
    'Bm7': {
        frets: [2, 3, 2, 4, 2, -1],
        diagram: `
  Bm7 (Barre)
e |---2---
B |---3---
G |---2---
D |---4---
A |---2---
E |---X---`
    },
    
    // Suspended Chords
    'Csus2': {
        frets: [3, 3, 0, 0, 3, -1],
        diagram: `
  Csus2
e |---3---
B |---3---
G |---0---
D |---0---
A |---3---
E |---X---`
    },
    'Dsus2': {
        frets: [0, 3, 2, 0, -1, -1],
        diagram: `
  Dsus2
e |---0---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'Esus2': {
        frets: [0, 0, 4, 4, 2, 0],
        diagram: `
  Esus2
e |---0---
B |---0---
G |---4---
D |---4---
A |---2---
E |---0---`
    },
    'Fsus2': {
        frets: [1, 1, 3, 3, 1, 1],
        diagram: `
  Fsus2 (Barre)
e |---1---
B |---1---
G |---3---
D |---3---
A |---1---
E |---1---`
    },
    'Gsus2': {
        frets: [3, 3, 0, 0, 3, 3],
        diagram: `
  Gsus2
e |---3---
B |---3---
G |---0---
D |---0---
A |---3---
E |---3---`
    },
    'Asus2': {
        frets: [0, 0, 2, 2, 0, -1],
        diagram: `
  Asus2
e |---0---
B |---0---
G |---2---
D |---2---
A |---0---
E |---X---`
    },
    'Bsus2': {
        frets: [2, 2, 4, 4, 2, -1],
        diagram: `
  Bsus2 (Barre)
e |---2---
B |---2---
G |---4---
D |---4---
A |---2---
E |---X---`
    },
    'Csus4': {
        frets: [1, 1, 0, 3, 3, -1],
        diagram: `
  Csus4
e |---1---
B |---1---
G |---0---
D |---3---
A |---3---
E |---X---`
    },
    'Dsus4': {
        frets: [3, 3, 2, 0, -1, -1],
        diagram: `
  Dsus4
e |---3---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'Esus4': {
        frets: [0, 0, 2, 2, 2, 0],
        diagram: `
  Esus4
e |---0---
B |---0---
G |---2---
D |---2---
A |---2---
E |---0---`
    },
    'Fsus4': {
        frets: [1, 1, 3, 3, 4, 1],
        diagram: `
  Fsus4 (Barre)
e |---1---
B |---1---
G |---3---
D |---3---
A |---4---
E |---1---`
    },
    'Gsus4': {
        frets: [3, 1, 0, 0, 3, 3],
        diagram: `
  Gsus4
e |---3---
B |---1---
G |---0---
D |---0---
A |---3---
E |---3---`
    },
    'Asus4': {
        frets: [0, 3, 2, 2, 0, -1],
        diagram: `
  Asus4
e |---0---
B |---3---
G |---2---
D |---2---
A |---0---
E |---X---`
    },
    'Bsus4': {
        frets: [2, 5, 4, 4, 2, -1],
        diagram: `
  Bsus4 (Barre)
e |---2---
B |---5---
G |---4---
D |---4---
A |---2---
E |---X---`
    },
    
    // Add9 Chords
    'Cadd9': {
        frets: [0, 3, 0, 2, 3, -1],
        diagram: `
  Cadd9
e |---0---
B |---3---
G |---0---
D |---2---
A |---3---
E |---X---`
    },
    'Dadd9': {
        frets: [0, 3, 2, 0, -1, -1],
        diagram: `
  Dadd9
e |---0---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---`
    },
    'Gadd9': {
        frets: [3, 0, 0, 0, 0, 3],
        diagram: `
  Gadd9
e |---3---
B |---0---
G |---0---
D |---0---
A |---0---
E |---3---`
    },
    'Eadd9': {
        frets: [2, 0, 1, 2, 2, 0],
        diagram: `
  Eadd9
e |---2---
B |---0---
G |---1---
D |---2---
A |---2---
E |---0---`
    },
    'Fadd9': {
        frets: [1, 1, 2, 0, 3, 1],
        diagram: `
  Fadd9 (Barre)
e |---1---
B |---1---
G |---2---
D |---0---
A |---3---
E |---1---`
    },
    'Aadd9': {
        frets: [0, 0, 2, 2, 0, -1],
        diagram: `
  Aadd9
e |---0---
B |---0---
G |---2---
D |---2---
A |---0---
E |---X---`
    },
    'Badd9': {
        frets: [2, 2, 4, 4, 2, -1],
        diagram: `
  Badd9 (Barre)
e |---2---
B |---2---
G |---4---
D |---4---
A |---2---
E |---X---`
    },
    
    // Diminished Chords
    'Cdim': {
        frets: [2, 4, 2, 4, 3, -1],
        diagram: `
  Cdim
e |---2---
B |---4---
G |---2---
D |---4---
A |---3---
E |---X---`
    },
    'Ddim': {
        frets: [1, 0, 1, 0, -1, -1],
        diagram: `
  Ddim
e |---1---
B |---0---
G |---1---
D |---0---
A |---X---
E |---X---`
    },
    'Edim': {
        frets: [0, 2, 0, 2, 1, 0],
        diagram: `
  Edim
e |---0---
B |---2---
G |---0---
D |---2---
A |---1---
E |---0---`
    },
    'Fdim': {
        frets: [1, 3, 1, 3, 2, 1],
        diagram: `
  Fdim
e |---1---
B |---3---
G |---1---
D |---3---
A |---2---
E |---1---`
    },
    'Gdim': {
        frets: [3, 5, 3, 5, 4, 3],
        diagram: `
  Gdim
e |---3---
B |---5---
G |---3---
D |---5---
A |---4---
E |---3---`
    },
    'Adim': {
        frets: [2, 1, 2, 1, 0, -1],
        diagram: `
  Adim
e |---2---
B |---1---
G |---2---
D |---1---
A |---0---
E |---X---`
    },
    'Bdim': {
        frets: [4, 3, 4, 3, 2, -1],
        diagram: `
  Bdim
e |---4---
B |---3---
G |---4---
D |---3---
A |---2---
E |---X---`
    },

    // Sharp/Flat Major Chords
    'C#': {
        frets: [4, 6, 6, 6, 4, -1],
        diagram: `
  C# Major (Barre)
e |---4---
B |---6---
G |---6---
D |---6---
A |---4---
E |---X---`
    },
    'Db': {
        frets: [4, 6, 6, 6, 4, -1],
        diagram: `
  Db Major (Barre)
e |---4---
B |---6---
G |---6---
D |---6---
A |---4---
E |---X---`
    },
    'D#': {
        frets: [3, 5, 5, 3, -1, -1],
        diagram: `
  D# Major (Barre)
e |---3---
B |---5---
G |---5---
D |---3---
A |---X---
E |---X---`
    },
    'Eb': {
        frets: [3, 5, 5, 3, -1, -1],
        diagram: `
  Eb Major (Barre)
e |---3---
B |---5---
G |---5---
D |---3---
A |---X---
E |---X---`
    },
    'F#': {
        frets: [2, 2, 3, 4, 4, 2],
        diagram: `
  F# Major (Barre)
e |---2---
B |---2---
G |---3---
D |---4---
A |---4---
E |---2---`
    },
    'Gb': {
        frets: [2, 2, 3, 4, 4, 2],
        diagram: `
  Gb Major (Barre)
e |---2---
B |---2---
G |---3---
D |---4---
A |---4---
E |---2---`
    },
    'G#': {
        frets: [4, 1, 1, 1, 3, 4],
        diagram: `
  G# Major (Barre)
e |---4---
B |---1---
G |---1---
D |---1---
A |---3---
E |---4---`
    },
    'Ab': {
        frets: [4, 1, 1, 1, 3, 4],
        diagram: `
  Ab Major (Barre)
e |---4---
B |---1---
G |---1---
D |---1---
A |---3---
E |---4---`
    },
    'A#': {
        frets: [1, 3, 3, 3, 1, -1],
        diagram: `
  A# Major (Barre)
e |---1---
B |---3---
G |---3---
D |---3---
A |---1---
E |---X---`
    },
    'Bb': {
        frets: [1, 3, 3, 3, 1, -1],
        diagram: `
  Bb Major (Barre)
e |---1---
B |---3---
G |---3---
D |---3---
A |---1---
E |---X---`
    },

    // Sharp/Flat Minor Chords
    'C#m': {
        frets: [4, 5, 6, 6, 4, -1],
        diagram: `
  C# minor (Barre)
e |---4---
B |---5---
G |---6---
D |---6---
A |---4---
E |---X---`
    },
    'Dbm': {
        frets: [4, 5, 6, 6, 4, -1],
        diagram: `
  Db minor (Barre)
e |---4---
B |---5---
G |---6---
D |---6---
A |---4---
E |---X---`
    },
    'D#m': {
        frets: [3, 4, 5, 5, 3, -1],
        diagram: `
  D# minor (Barre)
e |---3---
B |---4---
G |---5---
D |---5---
A |---3---
E |---X---`
    },
    'Ebm': {
        frets: [3, 4, 5, 5, 3, -1],
        diagram: `
  Eb minor (Barre)
e |---3---
B |---4---
G |---5---
D |---5---
A |---3---
E |---X---`
    },
    'F#m': {
        frets: [2, 2, 2, 2, 4, 2],
        diagram: `
  F# minor (Barre)
e |---2---
B |---2---
G |---2---
D |---4---
A |---4---
E |---2---`
    },
    'Gbm': {
        frets: [2, 2, 2, 2, 4, 2],
        diagram: `
  Gb minor (Barre)
e |---2---
B |---2---
G |---2---
D |---4---
A |---4---
E |---2---`
    },
    'G#m': {
        frets: [4, 4, 4, 4, 6, 4],
        diagram: `
  G# minor (Barre)
e |---4---
B |---4---
G |---4---
D |---6---
A |---6---
E |---4---`
    },
    'Abm': {
        frets: [4, 4, 4, 4, 6, 4],
        diagram: `
  Ab minor (Barre)
e |---4---
B |---4---
G |---4---
D |---6---
A |---6---
E |---4---`
    },
    'A#m': {
        frets: [1, 1, 1, 3, 3, 1],
        diagram: `
  A# minor (Barre)
e |---1---
B |---1---
G |---1---
D |---3---
A |---3---
E |---1---`
    },
    'Bbm': {
        frets: [1, 1, 1, 3, 3, 1],
        diagram: `
  Bb minor (Barre)
e |---1---
B |---1---
G |---1---
D |---3---
A |---3---
E |---1---`
    },

    // Sharp/Flat 7th Chords
    'C#7': {
        frets: [4, 6, 6, 4, 4, -1],
        diagram: `
  C#7 (Barre)
e |---4---
B |---6---
G |---6---
D |---4---
A |---4---
E |---X---`
    },
    'Db7': {
        frets: [4, 6, 6, 4, 4, -1],
        diagram: `
  Db7 (Barre)
e |---4---
B |---6---
G |---6---
D |---4---
A |---4---
E |---X---`
    },
    'D#7': {
        frets: [3, 5, 5, 3, 5, 3],
        diagram: `
  D#7 (Barre)
e |---3---
B |---5---
G |---5---
D |---3---
A |---5---
E |---3---`
    },
    'Eb7': {
        frets: [3, 5, 5, 3, 5, 3],
        diagram: `
  Eb7 (Barre)
e |---3---
B |---5---
G |---5---
D |---3---
A |---5---
E |---3---`
    },
    'F#7': {
        frets: [2, 2, 3, 2, 4, 2],
        diagram: `
  F#7 (Barre)
e |---2---
B |---2---
G |---3---
D |---2---
A |---4---
E |---2---`
    },
    'Gb7': {
        frets: [2, 2, 3, 2, 4, 2],
        diagram: `
  Gb7 (Barre)
e |---2---
B |---2---
G |---3---
D |---2---
A |---4---
E |---2---`
    },
    'G#7': {
        frets: [4, 4, 5, 4, 6, 4],
        diagram: `
  G#7 (Barre)
e |---4---
B |---4---
G |---5---
D |---4---
A |---6---
E |---4---`
    },
    'Ab7': {
        frets: [4, 4, 5, 4, 6, 4],
        diagram: `
  Ab7 (Barre)
e |---4---
B |---4---
G |---5---
D |---4---
A |---6---
E |---4---`
    },
    'A#7': {
        frets: [1, 3, 3, 1, 3, 1],
        diagram: `
  A#7 (Barre)
e |---1---
B |---3---
G |---3---
D |---1---
A |---3---
E |---1---`
    },
    'Bb7': {
        frets: [1, 3, 3, 1, 3, 1],
        diagram: `
  Bb7 (Barre)
e |---1---
B |---3---
G |---3---
D |---1---
A |---3---
E |---1---`
    },

    // Sharp/Flat Major 7th Chords
    'C#maj7': {
        frets: [4, 6, 6, 5, 4, -1],
        diagram: `
  C#maj7 (Barre)
e |---4---
B |---6---
G |---6---
D |---5---
A |---4---
E |---X---`
    },
    'Dbmaj7': {
        frets: [4, 6, 6, 5, 4, -1],
        diagram: `
  Dbmaj7 (Barre)
e |---4---
B |---6---
G |---6---
D |---5---
A |---4---
E |---X---`
    },
    'Ebmaj7': {
        frets: [3, 5, 5, 4, 3, -1],
        diagram: `
  Ebmaj7 (Barre)
e |---3---
B |---5---
G |---5---
D |---4---
A |---3---
E |---X---`
    },
    'F#maj7': {
        frets: [2, 2, 3, 3, 4, 2],
        diagram: `
  F#maj7 (Barre)
e |---2---
B |---2---
G |---3---
D |---3---
A |---4---
E |---2---`
    },
    'Gbmaj7': {
        frets: [2, 2, 3, 3, 4, 2],
        diagram: `
  Gbmaj7 (Barre)
e |---2---
B |---2---
G |---3---
D |---3---
A |---4---
E |---2---`
    },
    'Abmaj7': {
        frets: [4, 4, 5, 5, 6, 4],
        diagram: `
  Abmaj7 (Barre)
e |---4---
B |---4---
G |---5---
D |---5---
A |---6---
E |---4---`
    },
    'Bbmaj7': {
        frets: [1, 3, 3, 2, 1, -1],
        diagram: `
  Bbmaj7 (Barre)
e |---1---
B |---3---
G |---3---
D |---2---
A |---1---
E |---X---`
    },

    // Sharp/Flat Minor 7th Chords
    'C#m7': {
        frets: [4, 5, 6, 4, 4, -1],
        diagram: `
  C#m7 (Barre)
e |---4---
B |---5---
G |---6---
D |---4---
A |---4---
E |---X---`
    },
    'Ebm7': {
        frets: [3, 4, 5, 3, 3, -1],
        diagram: `
  Ebm7 (Barre)
e |---3---
B |---4---
G |---5---
D |---3---
A |---3---
E |---X---`
    },
    'F#m7': {
        frets: [2, 2, 2, 2, 4, 2],
        diagram: `
  F#m7 (Barre)
e |---2---
B |---2---
G |---2---
D |---2---
A |---4---
E |---2---`
    },
    'Abm7': {
        frets: [4, 4, 4, 4, 6, 4],
        diagram: `
  Abm7 (Barre)
e |---4---
B |---4---
G |---4---
D |---4---
A |---6---
E |---4---`
    },
    'Bbm7': {
        frets: [1, 1, 1, 1, 3, 1],
        diagram: `
  Bbm7 (Barre)
e |---1---
B |---1---
G |---1---
D |---1---
A |---3---
E |---1---`
    },

    // Power Chords
    'C5': {
        frets: [-1, -1, -1, 3, 5, 3],
        diagram: `
  C5 (Power Chord)
e |---X---
B |---X---
G |---X---
D |---3---
A |---5---
E |---3---`
    },
    'D5': {
        frets: [-1, -1, -1, 0, 2, 0],
        diagram: `
  D5 (Power Chord)
e |---X---
B |---X---
G |---X---
D |---0---
A |---2---
E |---0---`
    },
    'E5': {
        frets: [-1, -1, -1, 2, 2, 0],
        diagram: `
  E5 (Power Chord)
e |---X---
B |---X---
G |---X---
D |---2---
A |---2---
E |---0---`
    },
    'F5': {
        frets: [-1, -1, -1, 3, 3, 1],
        diagram: `
  F5 (Power Chord)
e |---X---
B |---X---
G |---X---
D |---3---
A |---3---
E |---1---`
    },
    'G5': {
        frets: [-1, -1, -1, 0, 2, 3],
        diagram: `
  G5 (Power Chord)
e |---X---
B |---X---
G |---X---
D |---0---
A |---2---
E |---3---`
    },
    'A5': {
        frets: [-1, -1, -1, 2, 2, 0],
        diagram: `
  A5 (Power Chord)
e |---X---
B |---X---
G |---X---
D |---2---
A |---2---
E |---0---`
    },
    'B5': {
        frets: [-1, -1, -1, 4, 4, 2],
        diagram: `
  B5 (Power Chord)
e |---X---
B |---X---
G |---X---
D |---4---
A |---4---
E |---2---`
    }
};

const CHORD_ALTERNATIVES = {
    // Major chord alternatives
    'C': ['Cmaj7', 'Cadd9', 'C7', 'Csus4', 'Csus2'],
    'D': ['Dmaj7', 'Dadd9', 'D7', 'Dsus4', 'Dsus2'],
    'E': ['Emaj7', 'Eadd9', 'E7', 'Esus4', 'Esus2'],
    'F': ['Fmaj7', 'Fadd9', 'F7', 'Fsus4', 'Fsus2'],
    'G': ['Gmaj7', 'Gadd9', 'G7', 'Gsus4', 'Gsus2'],
    'A': ['Amaj7', 'Aadd9', 'A7', 'Asus4', 'Asus2'],
    'B': ['B7', 'Bmaj7', 'Badd9', 'Bsus4', 'Bsus2'],

    // Sharp/Flat Major chord alternatives
    'C#': ['C#maj7', 'C#7', 'C#m'],
    'Db': ['Dbmaj7', 'Db7', 'Dbm'],
    'D#': ['D#7', 'D#m'],
    'Eb': ['Ebmaj7', 'Eb7', 'Ebm'],
    'F#': ['F#maj7', 'F#7', 'F#m'],
    'Gb': ['Gbmaj7', 'Gb7', 'Gbm'],
    'G#': ['G#7', 'G#m'],
    'Ab': ['Abmaj7', 'Ab7', 'Abm'],
    'A#': ['A#7', 'A#m'],
    'Bb': ['Bbmaj7', 'Bb7', 'Bbm'],

    // Minor chord alternatives
    'Am': ['Am7', 'Asus2'],
    'Bm': ['Bm7', 'Bsus2'],
    'Cm': ['Cm7', 'Csus2'],
    'Dm': ['Dm7', 'Dsus2'],
    'Em': ['Em7', 'Esus2'],
    'Fm': ['Fm7', 'Fsus2'],
    'Gm': ['Gm7', 'Gsus2'],

    // Sharp/Flat Minor chord alternatives
    'C#m': ['C#m7', 'C#'],
    'Dbm': ['C#m7', 'Db'],
    'D#m': ['Ebm7', 'Eb'],
    'Ebm': ['Ebm7', 'Eb'],
    'F#m': ['F#m7', 'F#'],
    'Gbm': ['F#m7', 'Gb'],
    'G#m': ['Abm7', 'Ab'],
    'Abm': ['Abm7', 'Ab'],
    'A#m': ['Bbm7', 'Bb'],
    'Bbm': ['Bbm7', 'Bb'],
    
    // 7th chord alternatives
    'C7': ['Cmaj7', 'C', 'Csus4'],
    'D7': ['Dmaj7', 'D', 'Dsus4'],
    'E7': ['Emaj7', 'E', 'Esus4'],
    'F7': ['Fmaj7', 'F', 'Fsus4'],
    'G7': ['Gmaj7', 'G', 'Gsus4'],
    'A7': ['Amaj7', 'A', 'Asus4'],
    'B7': ['Bmaj7', 'B', 'Bsus4'],
    
    // Sus chord alternatives
    'Csus4': ['C', 'Csus2'],
    'Dsus4': ['D', 'Dsus2'],
    'Esus4': ['E', 'Esus2'],
    'Fsus4': ['F', 'Fsus2'],
    'Gsus4': ['G', 'Gsus2'],
    'Asus4': ['A', 'Asus2'],
    'Bsus4': ['B', 'Bsus2'],
    
    // Add9 chord alternatives
    'Cadd9': ['C', 'Cmaj7', 'Csus2'],
    'Dadd9': ['D', 'Dmaj7', 'Dsus2'],
    'Eadd9': ['E', 'Emaj7', 'Esus2'],
    'Fadd9': ['F', 'Fmaj7', 'Fsus2'],
    'Gadd9': ['G', 'Gmaj7', 'Gsus2'],
    'Aadd9': ['A', 'Amaj7', 'Asus2'],
    'Badd9': ['B', 'Bmaj7', 'Bsus2'],
    
    // Diminished chord alternatives
    'Cdim': ['C', 'Cm'],
    'Ddim': ['D', 'Dm'],
    'Edim': ['E', 'Em'],
    'Fdim': ['F', 'Fm'],
    'Gdim': ['G', 'Gm'],
    'Adim': ['A', 'Am'],
    'Bdim': ['B', 'Bm']
};

function parseChordChart(text) {
    const lines = text.split('\n');
    const parsedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim() === '') {
            parsedLines.push({ type: 'empty', content: '' });
            continue;
        }
        
        const chordPattern = /\b[A-G](?:[#♯]|b|♭)?(?:maj(?:7|9|11|13)?|min(?:7|9|11|13)?|m(?:7|9|11|13)?(?:b5)?|7(?:b5)?|sus[24]?|add[29]|dim7?|aug|°7?|\+7?|6|9|11|13|5)*(?:\/[A-G](?:[#♯]|b|♭)?)?\b/g;
        const allMatches = [...line.matchAll(chordPattern)];

        // Filter out false positives like the article "A" followed by lowercase words
        const matches = allMatches.filter(match => {
            const chord = match[0];
            const position = match.index;

            // If it's just the letter "A" and followed by a space and lowercase letter, it's likely an article
            if (chord === 'A' && line[position + 1] === ' ' && line[position + 2] && line[position + 2].match(/[a-z]/)) {
                return false;
            }

            return true;
        });

        // Check if this is a chord line (has chords but minimal lyrics)
        const hasChords = matches.length > 0;
        const chordContent = matches.map(m => m[0]).join('');
        const nonChordContent = line.replace(chordPattern, '').trim();
        const isChordLine = hasChords && (nonChordContent.length < chordContent.length || nonChordContent.length < 10);
        
        if (isChordLine && i + 1 < lines.length) {
            // This is a chord line, check if next line is lyrics
            const nextLine = lines[i + 1];
            const nextHasChords = [...nextLine.matchAll(chordPattern)].length > 0;
            
            if (!nextHasChords && nextLine.trim() !== '') {
                // Next line is lyrics, create combined chord-lyric line
                const combinedLine = createChordLyricLine(line, nextLine);
                parsedLines.push({ type: 'chord-lyric', content: combinedLine });
                i++; // Skip the next line since we processed it
                continue;
            }
        }
        
        if (hasChords) {
            let result = '';
            let lastIndex = 0;
            
            for (let match of matches) {
                result += escapeHtml(line.slice(lastIndex, match.index));
                result += `<span class="chord" data-chord="${escapeHtml(match[0])}">${escapeHtml(match[0])}</span>`;
                lastIndex = match.index + match[0].length;
            }
            result += escapeHtml(line.slice(lastIndex));
            
            parsedLines.push({ type: 'chords', content: result });
        } else {
            parsedLines.push({ type: 'lyrics', content: escapeHtml(line) });
        }
    }
    
    return parsedLines;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createChordLyricLine(chordLine, lyricLine) {
    const chordPattern = /\b[A-G](?:[#♯]|b|♭)?(?:maj(?:7|9|11|13)?|min(?:7|9|11|13)?|m(?:7|9|11|13)?(?:b5)?|7(?:b5)?|sus[24]?|add[29]|dim7?|aug|°7?|\+7?|6|9|11|13|5)*(?:\/[A-G](?:[#♯]|b|♭)?)?\b/g;
    const allMatches = [...chordLine.matchAll(chordPattern)];

    // Filter out false positives like the article "A" followed by lowercase words
    const chordMatches = allMatches.filter(match => {
        const chord = match[0];
        const position = match.index;

        // If it's just the letter "A" and followed by a space and lowercase letter, it's likely an article
        if (chord === 'A' && chordLine[position + 1] === ' ' && chordLine[position + 2] && chordLine[position + 2].match(/[a-z]/)) {
            return false;
        }

        return true;
    });

    if (chordMatches.length === 0) {
        return `<span class="lyric-segment">${escapeHtml(lyricLine)}</span>`;
    }

    // Build the chord line with proper spacing
    let chordLineHtml = '<div class="chord-line-display" style="margin-bottom: 0.25rem;">';
    let lastPosition = 0;

    chordMatches.forEach(match => {
        const chord = match[0];
        const position = match.index;

        // Add spacing before the chord to align it with lyrics
        if (position > lastPosition) {
            const spacer = '&nbsp;'.repeat(position - lastPosition);
            chordLineHtml += `<span>${spacer}</span>`;
        }

        chordLineHtml += `<span class="chord" data-chord="${escapeHtml(chord)}">${escapeHtml(chord)}</span>`;
        lastPosition = position + chord.length;
    });

    chordLineHtml += '</div>';

    // Add the lyric line below
    const lyricLineHtml = `<div class="lyric-line-display"><span class="lyric-segment">${escapeHtml(lyricLine)}</span></div>`;

    return chordLineHtml + lyricLineHtml;
}

function renderChordChart(parsedChart) {
    return parsedChart.map(line => {
        if (line.type === 'empty') return '<br>';
        if (line.type === 'chord-lyric') {
            return `<div class="chart-line chord-lyric-combined">${line.content}</div>`;
        }
        return `<div class="chart-line ${line.type}">${line.content}</div>`;
    }).join('');
}

function getChordDiagram(chordName) {
    // First try the exact chord name
    if (CHORD_DIAGRAMS[chordName]) {
        return CHORD_DIAGRAMS[chordName];
    }
    
    // If not found, try some common variations
    // Clean up common variations but preserve important modifiers
    const cleanName = chordName.trim();
    
    // Try some common alternative notations
    const alternatives = [
        cleanName,
        cleanName.replace('min', 'm'),
        cleanName.replace(/°/g, 'dim'),
        cleanName.replace(/\+/g, 'aug'),
        cleanName.replace(/♯/g, '#'),
        cleanName.replace(/♭/g, 'b')
    ];
    
    for (const alt of alternatives) {
        if (CHORD_DIAGRAMS[alt]) {
            return CHORD_DIAGRAMS[alt];
        }
    }
    
    return null;
}

function getChordAlternatives(chordName) {
    const baseChord = chordName.replace(/[^A-G#b]/g, '');
    return CHORD_ALTERNATIVES[baseChord] || CHORD_ALTERNATIVES[chordName] || [];
}