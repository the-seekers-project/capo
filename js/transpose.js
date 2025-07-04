const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function parseChord(chord) {
    const match = chord.match(/^([A-G])(#|b)?(.*)$/);
    if (!match) return null;
    
    return {
        root: match[1],
        accidental: match[2] || '',
        suffix: match[3] || ''
    };
}

function getNoteIndex(note, accidental = '') {
    const fullNote = note + accidental;
    let index = NOTES.indexOf(fullNote);
    if (index === -1) {
        index = FLAT_NOTES.indexOf(fullNote);
    }
    return index;
}

function transposeNote(note, accidental, semitones) {
    const currentIndex = getNoteIndex(note, accidental);
    if (currentIndex === -1) return note + accidental;
    
    let newIndex = (currentIndex + semitones + 12) % 12;
    
    const originalNote = note + accidental;
    const useFlats = FLAT_NOTES.includes(originalNote) || 
                     (semitones < 0 && ['F', 'C', 'G', 'D', 'A'].includes(note));
    
    return useFlats ? FLAT_NOTES[newIndex] : NOTES[newIndex];
}

function transposeChord(chord, semitones) {
    const parsed = parseChord(chord);
    if (!parsed) return chord;
    
    const newRoot = transposeNote(parsed.root, parsed.accidental, semitones);
    return newRoot + parsed.suffix;
}

function transposeChordChart(chartHtml, semitones) {
    if (semitones === 0) return chartHtml;
    
    return chartHtml.replace(/<span class="chord" data-chord="([^"]+)">([^<]+)<\/span>/g, 
        (match, dataChord, displayChord) => {
            const newChord = transposeChord(dataChord, semitones);
            return `<span class="chord" data-chord="${newChord}">${newChord}</span>`;
        }
    );
}

function detectKey(chords) {
    const chordCounts = {};
    const majorKeys = {
        'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
        'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em'],
        'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm'],
        'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m'],
        'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m'],
        'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m'],
        'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m'],
        'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm'],
        'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm'],
        'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm'],
        'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm'],
        'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm']
    };
    
    for (let chord of chords) {
        const baseChord = chord.replace(/[^A-G#b]/g, '').replace(/m$/, 'm');
        chordCounts[baseChord] = (chordCounts[baseChord] || 0) + 1;
    }
    
    let bestKey = 'C';
    let bestScore = 0;
    
    for (let [key, keyChords] of Object.entries(majorKeys)) {
        let score = 0;
        for (let chord of keyChords) {
            if (chordCounts[chord]) {
                score += chordCounts[chord];
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestKey = key;
        }
    }
    
    return bestKey;
}

function getTransposedKey(originalKey, semitones) {
    const parsed = parseChord(originalKey);
    if (!parsed) return originalKey;
    
    return transposeNote(parsed.root, parsed.accidental, semitones);
}