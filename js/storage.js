class StorageManager {
    constructor() {
        this.storageKey = 'capo-saved-songs';
        this.settingsKey = 'capo-settings';
    }
    
    getSavedSongs() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading saved songs:', error);
            return [];
        }
    }
    
    saveSong(song) {
        try {
            const saved = this.getSavedSongs();
            const existingIndex = saved.findIndex(s => 
                s.title === song.title && s.artist === song.artist
            );
            
            if (existingIndex >= 0) {
                saved[existingIndex] = { ...song, savedAt: Date.now() };
            } else {
                saved.push({ ...song, savedAt: Date.now() });
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(saved));
            return true;
        } catch (error) {
            console.error('Error saving song:', error);
            return false;
        }
    }
    
    removeSong(title, artist) {
        try {
            const saved = this.getSavedSongs();
            const filtered = saved.filter(s => 
                !(s.title === title && s.artist === artist)
            );
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error removing song:', error);
            return false;
        }
    }
    
    isSongSaved(title, artist) {
        const saved = this.getSavedSongs();
        return saved.some(s => s.title === title && s.artist === artist);
    }
    
    getSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            return settings ? JSON.parse(settings) : {
                fontSize: 16,
                lyricFontSize: 20,
                scrollSpeed: 1,
                autoScroll: false
            };
        } catch (error) {
            console.error('Error loading settings:', error);
            return {
                fontSize: 16,
                lyricFontSize: 20,
                scrollSpeed: 1,
                autoScroll: false
            };
        }
    }
    
    saveSetting(key, value) {
        try {
            const settings = this.getSettings();
            settings[key] = value;
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving setting:', error);
            return false;
        }
    }
    
    exportData() {
        return {
            songs: this.getSavedSongs(),
            settings: this.getSettings(),
            exportedAt: new Date().toISOString()
        };
    }
    
    importData(data) {
        try {
            if (data.songs) {
                localStorage.setItem(this.storageKey, JSON.stringify(data.songs));
            }
            if (data.settings) {
                localStorage.setItem(this.settingsKey, JSON.stringify(data.settings));
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
    
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.settingsKey);
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }
}