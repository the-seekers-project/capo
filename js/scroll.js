class AutoScroller {
    constructor() {
        this.isScrolling = false;
        this.speed = 1;
        this.intervalId = null;
        this.baseScrollAmount = 1;
        this.speedMultiplier = 1;
    }
    
    start() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const scrollAmount = this.baseScrollAmount * this.speedMultiplier;
        
        this.intervalId = setInterval(() => {
            window.scrollBy(0, scrollAmount);
            
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                this.stop();
            }
        }, 50);
        
        this.updateUI();
    }
    
    stop() {
        if (!this.isScrolling) return;
        
        this.isScrolling = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.updateUI();
    }
    
    toggle() {
        if (this.isScrolling) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    setSpeed(speed) {
        this.speedMultiplier = Math.max(0.25, Math.min(4, speed));
        
        if (this.isScrolling) {
            this.stop();
            this.start();
        }
        
        this.updateSpeedDisplay();
    }
    
    increaseSpeed() {
        this.setSpeed(this.speedMultiplier + 0.25);
    }
    
    decreaseSpeed() {
        this.setSpeed(this.speedMultiplier - 0.25);
    }
    
    updateUI() {
        const autoScrollBtn = document.getElementById('auto-scroll-btn');
        const floatingAutoScrollBtn = document.getElementById('floating-auto-scroll');
        const headerAutoScrollBtn = document.getElementById('header-auto-scroll');
        const scrollControls = document.getElementById('auto-scroll-controls');
        const pauseBtn = document.getElementById('scroll-pause');
        
        // Update legacy button if it exists
        if (autoScrollBtn) {
            autoScrollBtn.textContent = this.isScrolling ? '⏸' : '▶';
            autoScrollBtn.title = this.isScrolling ? 'Pause auto-scroll' : 'Start auto-scroll';
        }
        
        // Update floating button
        if (floatingAutoScrollBtn) {
            floatingAutoScrollBtn.textContent = this.isScrolling ? '⏸' : '▶';
            floatingAutoScrollBtn.title = this.isScrolling ? 'Pause auto-scroll' : 'Start auto-scroll';
            if (this.isScrolling) {
                floatingAutoScrollBtn.classList.add('active');
            } else {
                floatingAutoScrollBtn.classList.remove('active');
            }
        }
        
        // Update header button
        if (headerAutoScrollBtn) {
            headerAutoScrollBtn.textContent = this.isScrolling ? '⏸' : '▶';
            headerAutoScrollBtn.title = this.isScrolling ? 'Pause auto-scroll' : 'Start auto-scroll';
            if (this.isScrolling) {
                headerAutoScrollBtn.classList.add('active');
            } else {
                headerAutoScrollBtn.classList.remove('active');
            }
        }
        
        if (scrollControls) {
            if (this.isScrolling) {
                scrollControls.classList.remove('hidden');
            } else {
                scrollControls.classList.add('hidden');
            }
        }
        
        if (pauseBtn) {
            pauseBtn.textContent = this.isScrolling ? '⏸' : '▶';
        }
    }
    
    updateSpeedDisplay() {
        const speedDisplay = document.getElementById('scroll-speed');
        if (speedDisplay) {
            speedDisplay.textContent = `${this.speedMultiplier}x`;
        }
    }
    
    handleKeypress(event) {
        if (event.target.tagName === 'INPUT') return;
        
        switch (event.key) {
            case ' ':
                event.preventDefault();
                this.toggle();
                break;
            case 'ArrowUp':
                if (this.isScrolling) {
                    event.preventDefault();
                    this.increaseSpeed();
                }
                break;
            case 'ArrowDown':
                if (this.isScrolling) {
                    event.preventDefault();
                    this.decreaseSpeed();
                }
                break;
            case 'Escape':
                this.stop();
                break;
        }
    }
    
    handlePageClick(event) {
        if (event.target.closest('.scroll-controls') || 
            event.target.closest('.floating-controls') ||
            event.target.closest('.header-controls') ||
            event.target.closest('#auto-scroll-btn') ||
            event.target.classList.contains('chord')) {
            return;
        }
        
        if (this.isScrolling) {
            this.toggle();
        }
    }
    
    init() {
        document.addEventListener('keydown', (e) => this.handleKeypress(e));
        document.addEventListener('click', (e) => this.handlePageClick(e));
        
        const autoScrollBtn = document.getElementById('auto-scroll-btn');
        if (autoScrollBtn) {
            autoScrollBtn.addEventListener('click', () => this.toggle());
        }
        
        const scrollSlower = document.getElementById('scroll-slower');
        if (scrollSlower) {
            scrollSlower.addEventListener('click', () => this.decreaseSpeed());
        }
        
        const scrollFaster = document.getElementById('scroll-faster');
        if (scrollFaster) {
            scrollFaster.addEventListener('click', () => this.increaseSpeed());
        }
        
        const scrollPause = document.getElementById('scroll-pause');
        if (scrollPause) {
            scrollPause.addEventListener('click', () => this.toggle());
        }
        
        this.updateSpeedDisplay();
    }
}