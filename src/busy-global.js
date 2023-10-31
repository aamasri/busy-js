/*
 * global loader (attaches busy to the global window object)
 */

const debug = false;

// lazy load busy loader and it's dependencies (on first invocation only)
import(/* webpackChunkName: "busy" */ './busy').then(module => {
    window.busy = module;
    if (debug)
        console.debug('busy loaded', typeof window.busy);

}).catch(error => {
    throwLoadingError('busy', error);
});