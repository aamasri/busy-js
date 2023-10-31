/**
 * @fileOverview busy animation
 * @author Ananda Masri
 * @version 1.0.0
 */

const debug = false;

import './busy.styl';

let busyAnimation = false;
let modalOverlay = false;
export const queue = [];



// start loading animation
export async function start(id, timeout=7, modal=false) {
    id = id ? id.replace(/'/g, '') : '';	// strip any single quotes from id
    timeout = (typeof timeout === 'number') ? timeout * 1000 : 7000;
    const expiry = Date.now() + timeout;

    queue.push({ id: id, expiry: expiry, modal: modal });     // allows matching id to be stopped

    if (!busyAnimation) {
        const isInIframe = window.location !== window.parent.location;		// detects whether we're in an iframe
        const body = isInIframe ? parent.document.body : document.body;

        modalOverlay = document.createElement('div');
        modalOverlay.id = 'animated-loader-modal-overlay';
        document.body.appendChild(modalOverlay);

        busyAnimation = document.createElement('div');
        busyAnimation.id = 'animated-loader';
        busyAnimation.title = id;
        busyAnimation.innerHTML = '<div><div><div><div><div><div><div><div><div><div></div></div></div></div></div></div></div></div></div>';
        body.appendChild(busyAnimation);
    }

    busyAnimation.style.zIndex = onTopZIndex().toString();
    busyAnimation.style.display = 'block';   // fade in
    busyAnimation.style.opacity = '1';   // fade in

    if (modal)
        modalOverlay.style.opacity = '0.4';   // fade in

    window.setTimeout(() => { stop(id); }, timeout);   // dequeue
}




// stop loading animation
export function stop(id) {
    if (!queue.length)
        return;

    id = id ? id.toString().replace(/'/g, '') : '';	// strip any single quotes from id
    let arrayIndex;

    // pop specified busy id off queue
    if (id) {
        arrayIndex = queue.findIndex(busyItem => busyItem.id === id);
        if (arrayIndex > -1) {
            if (debug) console.debug(`busy item "${queue[arrayIndex].id}" completed before timeout!`);
            queue.splice(arrayIndex, 1);
        }
    }

    // find any expired busy item
    arrayIndex = queue.findIndex(busyItem => busyItem.expiry <= Date.now());
    if (arrayIndex > -1) {
        console.warn(`busy indication timed out waiting for "${queue[arrayIndex].id}" to finish!`);
        queue.splice(arrayIndex, 1);
    }

    // kill modal overlay if no modal items left in queue
    arrayIndex = queue.findIndex(busyItem => busyItem.modal);
    if (arrayIndex === -1)
        _hideModalOverlay();

    if (queue.length === 0) {
        _hideModalOverlay();
        busyAnimation.style.opacity = '0';		// fade out
    }
}



function _hideModalOverlay() {
    modalOverlay.style.opacity = '0';   // fade out
}



// clear the busy queue and stop the busy animation
export function reset() {
    queue.length = 0;
    busyAnimation.style.opacity = '0';		// fade out
}



// debug the busy animation queue
export function status() {
    console.log('busy queue:', queue);
}



/** Get the highest z-index in the document.
 *
 * @returns {number}
 */
function onTopZIndex() {
    let zTop = 0;
    const elements = document.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
        let zIndex = window.getComputedStyle(elements[i]).getPropertyValue('z-index');
        zIndex = isNaN(zIndex) ? 0 : parseInt(zIndex);
        if (zIndex && zIndex > zTop)
            zTop = zIndex;
    }

    return zTop;
}

