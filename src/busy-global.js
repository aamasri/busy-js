/*
 * global loader (attaches busy to the global window object)
 */

const debug = false;

// lazy load busy loader and it's dependencies (on first invocation only)
import(/* webpackChunkName: "busy" */ './busy').then(function (busyModule) {
    window.busy = busyModule;
    if (debug)
        console.debug('busy-js loaded', typeof window.busy);
});