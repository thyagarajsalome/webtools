// src/app.js
import StorageRepo from './core/StorageRepo.js';
import { setupServiceWorker } from './core/ServiceWorkerSetup.js';

class HDEApp {
    constructor() {
        this.db = new StorageRepo();
        this.init();
    }

    init() {
        // 1. Setup PWA & Service Worker
        setupServiceWorker();

        // 2. Setup Theme Singleton
        this.setupTheme();

        // 3. Delegate Calculator Logic based on current URL path
        this.routeCalculator();
    }

    routeCalculator() {
        const path = window.location.pathname;
        
        // Lazy load specific calculators based on the page to save initial bandwidth
        if (path.includes('electrical')) {
            import('./calculators/ElectricalCalc.js').then(({ default: ElectricalCalc }) => {
                new ElectricalCalc(this.db).init();
            });
        } else if (path.includes('flooring')) {
            import('./calculators/FlooringCalc.js').then(({ default: FlooringCalc }) => {
                new FlooringCalc(this.db).init();
            });
        }
        // Fallback for SPA routing if required
    }

    setupTheme() {
        // Theme logic
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => new HDEApp());