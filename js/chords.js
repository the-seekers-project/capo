const CHORD_DIAGRAMS = {
    // Major Chords
    'C': {
        frets: [0, 1, 0, 2, 3, 0],
        fingers: [0, 1, 0, 2, 3, 0],
        diagram: `
  C Major
e |---0---
B |---1---
G |---0---
D |---2---
A |---3---
E |---X---
    1 2 3`
    },
    'D': {
        frets: [-1, -1, 0, 2, 3, 2],
        fingers: [0, 0, 0, 1, 3, 2],
        diagram: `
  D Major
e |---2---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---
    1 3 2`
    },
    'E': {
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [0, 2, 3, 1, 0, 0],
        diagram: `
  E Major
e |---0---
B |---0---
G |---1---
D |---2---
A |---2---
E |---0---
    1 2 3`
    },
    'F': {
        frets: [1, 1, 2, 3, 3, 1],
        fingers: [1, 1, 2, 3, 4, 1],
        diagram: `
  F Major (Barre)
e |---1---
B |---1---
G |---2---
D |---3---
A |---3---
E |---1---
  1 1 2 3 4 1`
    },
    'G': {
        frets: [3, 2, 0, 0, 3, 3],
        fingers: [3, 2, 0, 0, 4, 3],
        diagram: `
  G Major
e |---3---
B |---0---
G |---0---
D |---0---
A |---2---
E |---3---
    2   3 4`
    },
    'A': {
        frets: [-1, 0, 2, 2, 2, 0],
        fingers: [0, 0, 1, 2, 3, 0],
        diagram: `
  A Major
e |---0---
B |---2---
G |---2---
D |---2---
A |---0---
E |---X---
    1 2 3`
    },
    'B': {
        frets: [-1, 2, 4, 4, 4, 2],
        fingers: [0, 1, 2, 3, 4, 1],
        diagram: `
  B Major (Barre)
e |---2---
B |---4---
G |---4---
D |---4---
A |---2---
E |---X---
  1 2 3 4 1`
    },
    
    // Minor Chords
    'Am': {
        frets: [-1, 0, 2, 2, 1, 0],
        fingers: [0, 0, 2, 3, 1, 0],
        diagram: `
  A minor
e |---0---
B |---1---
G |---2---
D |---2---
A |---0---
E |---X---
    1 2 3`
    },
    'Bm': {
        frets: [-1, 2, 4, 4, 3, 2],
        fingers: [0, 1, 3, 4, 2, 1],
        diagram: `
  B minor (Barre)
e |---2---
B |---3---
G |---4---
D |---4---
A |---2---
E |---X---
  1 2 3 4 1`
    },
    'Cm': {
        frets: [-1, 3, 5, 5, 4, 3],
        fingers: [0, 1, 3, 4, 2, 1],
        diagram: `
  C minor (Barre)
e |---3---
B |---4---
G |---5---
D |---5---
A |---3---
E |---X---
  1 2 3 4 1`
    },
    'Dm': {
        frets: [-1, -1, 0, 2, 3, 1],
        fingers: [0, 0, 0, 2, 3, 1],
        diagram: `
  D minor
e |---1---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---
    1 3 2`
    },
    'Em': {
        frets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 2, 3, 0, 0, 0],
        diagram: `
  E minor
e |---0---
B |---0---
G |---0---
D |---2---
A |---2---
E |---0---
    2 3`
    },
    'Fm': {
        frets: [1, 1, 1, 3, 4, 1],
        fingers: [1, 1, 1, 3, 4, 1],
        diagram: `
  F minor (Barre)
e |---1---
B |---1---
G |---1---
D |---3---
A |---4---
E |---1---
  1 1 1 3 4 1`
    },
    'Gm': {
        frets: [3, 3, 3, 5, 6, 3],
        fingers: [1, 1, 1, 3, 4, 1],
        diagram: `
  G minor (Barre)
e |---3---
B |---3---
G |---3---
D |---5---
A |---6---
E |---3---
  1 1 1 3 4 1`
    },
    
    // 7th Chords
    'C7': {
        frets: [0, 1, 3, 2, 3, 0],
        fingers: [0, 1, 4, 2, 3, 0],
        diagram: `
  C7
e |---0---
B |---1---
G |---3---
D |---2---
A |---3---
E |---X---
    1 4 2 3`
    },
    'D7': {
        frets: [-1, -1, 0, 2, 1, 2],
        fingers: [0, 0, 0, 3, 1, 2],
        diagram: `
  D7
e |---2---
B |---1---
G |---2---
D |---0---
A |---X---
E |---X---
    3 1 2`
    },
    'E7': {
        frets: [0, 2, 0, 1, 0, 0],
        fingers: [0, 2, 0, 1, 0, 0],
        diagram: `
  E7
e |---0---
B |---0---
G |---1---
D |---0---
A |---2---
E |---0---
    1   2`
    },
    'F7': {
        frets: [1, 1, 2, 1, 3, 1],
        fingers: [1, 1, 3, 1, 4, 1],
        diagram: `
  F7 (Barre)
e |---1---
B |---1---
G |---2---
D |---1---
A |---3---
E |---1---
  1 1 3 1 4 1`
    },
    'G7': {
        frets: [1, 2, 0, 0, 3, 3],
        fingers: [1, 2, 0, 0, 4, 3],
        diagram: `
  G7
e |---1---
B |---0---
G |---0---
D |---0---
A |---2---
E |---3---
    1   2 4`
    },
    'A7': {
        frets: [-1, 0, 2, 0, 2, 0],
        fingers: [0, 0, 2, 0, 3, 0],
        diagram: `
  A7
e |---0---
B |---2---
G |---0---
D |---2---
A |---0---
E |---X---
    2   3`
    },
    'B7': {
        frets: [-1, 2, 1, 2, 0, 2],
        fingers: [0, 3, 1, 2, 0, 4],
        diagram: `
  B7
e |---2---
B |---0---
G |---2---
D |---1---
A |---2---
E |---X---
    4   2 1 3`
    },
    
    // Major 7th Chords
    'Cmaj7': {
        frets: [0, 0, 0, 2, 3, 0],
        fingers: [0, 0, 0, 1, 2, 0],
        diagram: `
  Cmaj7
e |---0---
B |---0---
G |---0---
D |---2---
A |---3---
E |---X---
    1 2`
    },
    'Dmaj7': {
        frets: [-1, -1, 0, 2, 2, 2],
        fingers: [0, 0, 0, 1, 1, 1],
        diagram: `
  Dmaj7
e |---2---
B |---2---
G |---2---
D |---0---
A |---X---
E |---X---
    1 1 1`
    },
    'Emaj7': {
        frets: [0, 2, 1, 1, 0, 0],
        fingers: [0, 3, 1, 2, 0, 0],
        diagram: `
  Emaj7
e |---0---
B |---0---
G |---1---
D |---1---
A |---2---
E |---0---
    1 2 3`
    },
    'Fmaj7': {
        frets: [1, 1, 2, 2, 3, 1],
        fingers: [1, 1, 2, 3, 4, 1],
        diagram: `
  Fmaj7 (Barre)
e |---1---
B |---1---
G |---2---
D |---2---
A |---3---
E |---1---
  1 1 2 3 4 1`
    },
    'Gmaj7': {
        frets: [2, 2, 0, 0, 3, 3],
        fingers: [1, 2, 0, 0, 4, 3],
        diagram: `
  Gmaj7
e |---2---
B |---0---
G |---0---
D |---0---
A |---2---
E |---3---
    1   2 4`
    },
    'Amaj7': {
        frets: [-1, 0, 2, 1, 2, 0],
        fingers: [0, 0, 3, 1, 2, 0],
        diagram: `
  Amaj7
e |---0---
B |---2---
G |---1---
D |---2---
A |---0---
E |---X---
    3 1 2`
    },
    
    // Suspended Chords
    'Csus2': {
        frets: [-1, 3, 0, 0, 3, 3],
        fingers: [0, 1, 0, 0, 3, 2],
        diagram: `
  Csus2
e |---3---
B |---3---
G |---0---
D |---0---
A |---3---
E |---X---
    1 2   3`
    },
    'Csus4': {
        frets: [-1, 3, 3, 0, 1, 1],
        fingers: [0, 3, 4, 0, 1, 2],
        diagram: `
  Csus4
e |---1---
B |---1---
G |---0---
D |---3---
A |---3---
E |---X---
    1 2   3 4`
    },
    'Dsus2': {
        frets: [-1, -1, 0, 2, 3, 0],
        fingers: [0, 0, 0, 1, 2, 0],
        diagram: `
  Dsus2
e |---0---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---
    2 1`
    },
    'Dsus4': {
        frets: [-1, -1, 0, 2, 3, 3],
        fingers: [0, 0, 0, 1, 2, 3],
        diagram: `
  Dsus4
e |---3---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---
    1 2 3`
    },
    'Esus2': {
        frets: [0, 2, 4, 4, 0, 0],
        fingers: [0, 1, 3, 4, 0, 0],
        diagram: `
  Esus2
e |---0---
B |---0---
G |---4---
D |---4---
A |---2---
E |---0---
    1 3 4`
    },
    'Esus4': {
        frets: [0, 2, 2, 2, 0, 0],
        fingers: [0, 2, 3, 4, 0, 0],
        diagram: `
  Esus4
e |---0---
B |---0---
G |---2---
D |---2---
A |---2---
E |---0---
    2 3 4`
    },
    
    // Add9 Chords
    'Cadd9': {
        frets: [-1, 3, 2, 0, 3, 0],
        fingers: [0, 3, 2, 0, 4, 0],
        diagram: `
  Cadd9
e |---0---
B |---3---
G |---0---
D |---2---
A |---3---
E |---X---
    2   3 4`
    },
    'Dadd9': {
        frets: [-1, -1, 0, 2, 3, 0],
        fingers: [0, 0, 0, 1, 2, 0],
        diagram: `
  Dadd9
e |---0---
B |---3---
G |---2---
D |---0---
A |---X---
E |---X---
    2 1`
    },
    'Gadd9': {
        frets: [3, 0, 0, 0, 3, 3],
        fingers: [2, 0, 0, 0, 3, 4],
        diagram: `
  Gadd9
e |---3---
B |---0---
G |---0---
D |---0---
A |---0---
E |---3---
    2     3 4`
    }
};

const CHORD_ALTERNATIVES = {
    // Major chord alternatives
    'C': ['Cmaj7', 'Cadd9', 'C7', 'Csus4'],
    'D': ['Dmaj7', 'Dadd9', 'D7', 'Dsus4'],
    'E': ['Emaj7', 'Esus4', 'E7'],
    'F': ['Fmaj7', 'F7', 'Fsus4'],
    'G': ['Gmaj7', 'Gadd9', 'G7', 'Gsus4'],
    'A': ['Amaj7', 'A7', 'Asus4'],
    'B': ['B7', 'Bmaj7', 'Bsus4'],
    
    // Minor chord alternatives
    'Am': ['Am7', 'Asus2'],
    'Bm': ['Bm7', 'Bsus2'],
    'Cm': ['Cm7', 'Csus2'],
    'Dm': ['Dm7', 'Dsus2'],
    'Em': ['Em7', 'Esus2'],
    'Fm': ['Fm7', 'Fsus2'],
    'Gm': ['Gm7', 'Gsus2'],
    
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
    
    // Sharp/Flat alternatives
    'F#': ['F#7', 'F#m', 'Gb'],
    'Bb': ['Bb7', 'Bbmaj7', 'A#'],
    'C#': ['C#7', 'C#m', 'Db'],
    'Db': ['Db7', 'Dbmaj7', 'C#'],
    'Eb': ['Eb7', 'Ebmaj7', 'D#'],
    'Ab': ['Ab7', 'Abmaj7', 'G#']
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
        
        const chordPattern = /\b[A-G](?:[#♯]|b|♭)?(?:maj7?|min7?|m7?|7|sus[24]?|add[29]|dim7?|aug|6|9|11|13)*(?:\/[A-G](?:[#♯]|b|♭)?)?\b/g;
        const matches = [...line.matchAll(chordPattern)];
        
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
    const chordPattern = /\b[A-G](?:[#♯]|b|♭)?(?:maj7?|min7?|m7?|7|sus[24]?|add[29]|dim7?|aug|6|9|11|13)*(?:\/[A-G](?:[#♯]|b|♭)?)?\b/g;
    const chordMatches = [...chordLine.matchAll(chordPattern)];
    
    if (chordMatches.length === 0) {
        return escapeHtml(lyricLine);
    }
    
    let result = '<div class="chord-lyric-line">';
    let lyricIndex = 0;
    
    for (let i = 0; i < chordMatches.length; i++) {
        const match = chordMatches[i];
        const chordPosition = match.index;
        const chord = match[0];
        
        // Determine how much lyric text corresponds to this chord
        let lyricSegmentLength;
        if (i === chordMatches.length - 1) {
            // Last chord, take rest of lyrics
            lyricSegmentLength = lyricLine.length - lyricIndex;
        } else {
            // Calculate spacing based on chord positions
            const nextChordPosition = chordMatches[i + 1].index;
            const chordSpacing = nextChordPosition - chordPosition;
            lyricSegmentLength = Math.max(chordSpacing, chord.length + 1);
        }
        
        const lyricSegment = lyricLine.slice(lyricIndex, lyricIndex + lyricSegmentLength);
        
        result += `<span class="chord-lyric-pair">`;
        result += `<span class="chord" data-chord="${escapeHtml(chord)}">${escapeHtml(chord)}</span>`;
        result += `<span class="lyric-part">${escapeHtml(lyricSegment)}</span>`;
        result += `</span>`;
        
        lyricIndex += lyricSegmentLength;
    }
    
    // Add any remaining lyrics
    if (lyricIndex < lyricLine.length) {
        result += `<span class="lyric-part">${escapeHtml(lyricLine.slice(lyricIndex))}</span>`;
    }
    
    result += '</div>';
    return result;
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
    const baseChord = chordName.replace(/[^A-G#b]/g, '');
    return CHORD_DIAGRAMS[baseChord] || CHORD_DIAGRAMS[chordName];
}

function createVisualChordDiagram(chordData) {
    if (!chordData || !chordData.frets) {
        return `<div class="chord-not-found">Chord diagram not available</div>`;
    }

    const strings = ['e', 'B', 'G', 'D', 'A', 'E'];
    const frets = chordData.frets;
    const fingers = chordData.fingers || [];
    
    let visualHtml = '<div class="chord-diagram-visual">';
    
    // Fretboard
    visualHtml += '<div class="chord-fretboard">';
    
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
        visualHtml += '<div class="chord-string">';
        visualHtml += `<div class="string-name">${strings[stringIndex]}</div>`;
        
        for (let fretIndex = 0; fretIndex < 5; fretIndex++) {
            const fretValue = frets[stringIndex];
            const fingerValue = fingers[stringIndex] || 0;
            
            let fretClass = 'fret';
            let fretContent = '';
            
            if (fretValue === 0) {
                // Open string
                if (fretIndex === 0) {
                    fretClass += ' open';
                    fretContent = 'O';
                }
            } else if (fretValue === -1) {
                // Muted string
                if (fretIndex === 0) {
                    fretClass += ' muted';
                    fretContent = 'X';
                }
            } else if (fretValue === fretIndex + 1) {
                // Pressed fret
                fretClass += ' pressed';
                fretContent = fingerValue || fretValue;
            }
            
            visualHtml += `<div class="${fretClass}">${fretContent}</div>`;
        }
        
        visualHtml += '</div>';
    }
    
    visualHtml += '</div>';
    
    // Finger numbers column
    visualHtml += '<div class="finger-numbers">';
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
        const fingerValue = fingers[stringIndex] || '';
        const fretValue = frets[stringIndex];
        
        let displayValue = '';
        if (fretValue === 0) {
            displayValue = 'O'; // Open
        } else if (fretValue === -1) {
            displayValue = 'X'; // Muted
        } else if (fingerValue > 0) {
            displayValue = fingerValue; // Finger number
        }
        
        visualHtml += `<div>${displayValue}</div>`;
    }
    visualHtml += '</div>';
    
    visualHtml += '</div>';
    
    return visualHtml;
}

function getChordAlternatives(chordName) {
    const baseChord = chordName.replace(/[^A-G#b]/g, '');
    return CHORD_ALTERNATIVES[baseChord] || CHORD_ALTERNATIVES[chordName] || [];
}