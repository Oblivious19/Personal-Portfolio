import { writable } from 'svelte/store';

// true once the entry loader has finished (or was skipped)
export const loaderDone = writable(false);
