// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}


declare global {
    namespace svelteHTML {
        interface HTMLAttributes<T> {
            "on:enterViewport"?: (event: CustomEvent<any>) => void;
            "on:exitViewport"?: (event: CustomEvent<any>) => void;
            onenterViewport?: (event: CustomEvent<any>) => void;
            onexitViewport?: (event: CustomEvent<any>) => void;
        }
    }
}

export { };


