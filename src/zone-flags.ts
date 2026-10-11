/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */
(window as Window & { __Zone_disable_customElements?: boolean }).__Zone_disable_customElements = true;
