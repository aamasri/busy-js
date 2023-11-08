/**
 * @fileOverview busy animation
 */

const debug = false;

import './busy.styl';

let busyAnimation = false;
let modalOverlay = false;
let fadeoutAnimationTimer = false;
let fadeoutModalTimer = false;
export let queue = [];



// start loading animation
export async function start(id, timeout=7, modal=false) {
    window.clearTimeout(fadeoutAnimationTimer);
    id = id ? id.replace(/'/g, '') : '';	// strip any single quotes from id
    timeout = (typeof timeout === 'number') ? timeout * 1000 : 7000;

    const duplicateItem = queue.findIndex(item => item.id === id);
    if (duplicateItem > -1) {
        queue.splice(duplicateItem, 1);
        if (debug) console.debug(`busy item "${id}" already in queue!`);
    }

    // the queue is the master list controlling the busy animation
    queue.push({
        id: id,
        expiry: Date.now() + timeout,
        modal: modal
    });

    _updateBusy();
    window.setTimeout(() => { stop(id); }, timeout);   // dequeue item after timeout
}




// stop loading animation
export function stop(id) {
    if (queue.length) {
        id = id ? id.toString().replace(/'/g, '') : '';	// strip any single quotes from id
        let arrayIndex;

        // pop specified busy id off queue
        if (id) {
            arrayIndex = queue.findIndex(busyItem => busyItem.id === id);
            if (arrayIndex > -1) {
                if (debug) console.debug(`busy item "${queue[arrayIndex].id}" stopped!`);
                queue.splice(arrayIndex, 1);
            }
        }

        // remove any expired item from the queue
        queue.forEach(item => {
            if (item.expiry <= Date.now()) {
                arrayIndex = queue.findIndex(busyItem => busyItem.id === item.id);
                if (arrayIndex > -1) {
                    if (debug) console.debug(`removing expired busy item "${queue[arrayIndex].id}"`);
                    queue.splice(arrayIndex, 1);
                }
            }
        })
    }

    _updateBusy();
}




// clear the busy queue and stop the busy animation
export function reset() {
    queue = [];
    _updateBusy();
}



// debug the busy animation queue
export function status() {
    console.log('busy queue:', queue);
}



// monitor the queue and update the busy animation
function _updateBusy() {
    if (debug) console.debug(`_updateBusy() queue length: ${queue.length}`);
    if (queue.length === 0) {
        _fadeOutAnimation();
        _fadeOutModal();
    } else {
        _showAnimation(queue[0].id);
        if (queue.some(item => item.modal))
            _showModal()
        else
            _fadeOutModal();
    }
}



function _showAnimation(id) {
    window.clearTimeout(fadeoutAnimationTimer);

    // create busy animation elements if it doesn't exist (they can be hidden but never removed)
    if (!busyAnimation) {
        // detects whether we're in an iframe - we always want to attach the busy animation to the root document
        const isInIframe = window.location !== window.parent.location;
        const body = isInIframe ? parent.document.body : document.body;

        modalOverlay = document.createElement('div');
        modalOverlay.id = 'animated-loader-modal-overlay';
        document.body.appendChild(modalOverlay);

        busyAnimation = document.createElement('div');
        busyAnimation.id = 'animated-loader';
        busyAnimation.innerHTML = '<div><div><div><div><div><div><div><div><div><div></div></div></div></div></div></div></div></div></div>';
        body.appendChild(busyAnimation);
    }

    const topZ = onTopZIndex().toString();
    busyAnimation.style.zIndex = topZ;
    modalOverlay.style.zIndex = topZ;
    busyAnimation.title = id;
    busyAnimation.style.display = 'block';
    busyAnimation.style.opacity = '1';
}

function _showModal() {
    window.clearTimeout(fadeoutModalTimer);
    modalOverlay.style.display = 'block';
    modalOverlay.style.opacity = '1';
}

function _fadeOutAnimation() {
    window.clearTimeout(fadeoutAnimationTimer);

    // fade out
    busyAnimation.style.opacity = '0';

    // then hide
    fadeoutAnimationTimer = window.setTimeout(() => {
        busyAnimation.style.display = 'none';
    }, 500);   // hide
}

function _fadeOutModal() {
    window.clearTimeout(fadeoutModalTimer);

    // fadeout
    modalOverlay.style.opacity = '0';

    // then hide
    fadeoutModalTimer = window.setTimeout(() => {
        modalOverlay.style.display = 'none';
    }, 500);   // hide
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

