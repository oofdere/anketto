import { writable } from "svelte/store";

export default function createLocalStore(key:string) {
    // returns a writable store connected to localStorage[id]

    const currentValue = localStorage.getItem(key);
    const { subscribe, set, update } = writable(currentValue);

    return {
        subscribe,
        set: (val: string) => {
            localStorage.setItem(key, val);
            set(val);
        },
        index: key
    }
}