// src/utils/remoteControl.js
// Simple event emitter based on EventTarget (no external deps).
const emitter = new EventTarget()
let inited = false

export function initRemoteControl() {
    if (inited) {
        console.warn('remoteControl: already initialized')
        return
    }
    inited = true
    console.info('remoteControl: init')

    window.addEventListener('keydown', (e) => {
        const key = e.keyCode || e.which
        let action = null

        // Common STB/button codes (extend if needed)
        switch (key) {
            case 37: action = 'left'; break   // ←
            case 38: action = 'up'; break     // ↑
            case 39: action = 'right'; break  // →
            case 40: action = 'down'; break   // ↓
            case 13: action = 'enter'; break  // OK / Enter
            case 8:  action = 'back'; break   // Backspace
            case 27: action = 'back'; break   // ESC
            case 461: action = 'back'; break  // MAG / some STB back
            case 10009: action = 'back'; break // Android TV back sometimes
            case 46: action = 'exit'; break   // Delete
            // color buttons often: 403=red? 404=green? (varies). Add if you need.
            default: action = null
        }

        if (action) {
            // debug log
            // (в проде можно убрать)
            console.debug(`remoteControl: key=${key} => action=${action}`)
            try { e.preventDefault?.() } catch (err) {}
            const ev = new CustomEvent(action, { detail: { originalKey: key } })
            emitter.dispatchEvent(ev)
        }
    }, { passive: false })
}

// API: on/off/once
export const remote = {
    on(action, handler) {
        const wrapper = (e) => handler(e.detail)
        // store wrapper so we can remove later
        if (!handler._wrappers) handler._wrappers = new Map()
        handler._wrappers.set(action, wrapper)
        emitter.addEventListener(action, wrapper)
        return () => this.off(action, handler)
    },
    off(action, handler) {
        if (!handler || !handler._wrappers) return
        const wrapper = handler._wrappers.get(action)
        if (wrapper) {
            emitter.removeEventListener(action, wrapper)
            handler._wrappers.delete(action)
        }
    },
    once(action, handler) {
        const listener = (e) => {
            handler(e.detail)
            emitter.removeEventListener(action, listener)
        }
        emitter.addEventListener(action, listener)
    },
    // helper: clear all (rarely used)
    _clearAll() {
        // EventTarget doesn't support listing listeners — keep minimal API
        console.warn('remoteControl: clearAll not implemented')
    }
}
