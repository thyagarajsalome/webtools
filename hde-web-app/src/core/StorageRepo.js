// src/core/StorageRepo.js
export default class StorageRepo {
    constructor(storageKey = 'hde_projects') {
        this.storageKey = storageKey;
        this.cache = new Map(); // DSA: O(1) lookup map
        this._initialize();
    }

    _initialize() {
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        // Populate the Map
        data.forEach(project => this.cache.set(project.id, project));
    }

    _commit() {
        // Convert Map values back to array for localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.cache.values())));
    }

    getProject(id) {
        return this.cache.get(id); // O(1) Retrieval
    }

    getAllProjects() {
        // Returns sorted array (newest first)
        return Array.from(this.cache.values()).sort((a, b) => new Date(b.savedOn) - new Date(a.savedOn));
    }

    saveProject(project) {
        this.cache.set(project.id, project); // O(1) Insertion
        this._commit();
    }

    deleteProject(id) {
        const deleted = this.cache.delete(id); // O(1) Deletion
        if (deleted) this._commit();
        return deleted;
    }
}