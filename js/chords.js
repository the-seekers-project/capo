const CHORD_DIAGRAMS = {
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
    }
};

const CHORD_ALTERNATIVES = {
    'F': ['Fmaj7', 'F/C'],
    'B': ['B7', 'Bsus4'],
    'F#': ['F#7', 'F#m'],
    'Bb': ['Bb7', 'Bbmaj7'],
    'C#': ['C#7', 'C#m'],
    'Db': ['Db7', 'Dbmaj7'],
    'Eb': ['Eb7', 'Ebmaj7'],
    'Ab': ['Ab7', 'Abmaj7']
};

function parseChordChart(text) {
    const lines = text.split('\n');
    const parsedLines = [];
    
    for (let line of lines) {
        if (line.trim() === '') {
            parsedLines.push({ type: 'empty', content: '' });
            continue;
        }
        
        const chordPattern = /\b[A-G](?:#|b)?(?:maj|min|m|7|sus|add|dim|aug)?\d*(?:\/[A-G](?:#|b)?)?\b/g;
        const matches = [...line.matchAll(chordPattern)];
        
        if (matches.length > 0) {
            let result = '';
            let lastIndex = 0;
            
            for (let match of matches) {
                result += line.slice(lastIndex, match.index);
                result += `<span class="chord" data-chord="${match[0]}">${match[0]}</span>`;
                lastIndex = match.index + match[0].length;
            }
            result += line.slice(lastIndex);
            
            parsedLines.push({ type: 'chords', content: result });
        } else {
            parsedLines.push({ type: 'lyrics', content: line });
        }
    }
    
    return parsedLines;
}

function renderChordChart(parsedChart) {
    return parsedChart.map(line => {
        if (line.type === 'empty') return '<br>';
        return `<div class="chart-line ${line.type}">${line.content}</div>`;
    }).join('');
}

function getChordDiagram(chordName) {
    const baseChord = chordName.replace(/[^A-G#b]/g, '');
    return CHORD_DIAGRAMS[baseChord] || CHORD_DIAGRAMS[chordName];
}

function getChordAlternatives(chordName) {
    const baseChord = chordName.replace(/[^A-G#b]/g, '');
    return CHORD_ALTERNATIVES[baseChord] || CHORD_ALTERNATIVES[chordName] || [];
}