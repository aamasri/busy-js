/**
 * @fileOverview busy animation
 */

const debug = false;

import './busy.styl';

let busyAnimation = null;
let modalOverlay = null;
let fadeoutAnimationTimer;
let fadeoutModalTimer;



// start loading animation
export function start(id, timeout=7, modal=false) {
    window.top.clearTimeout(fadeoutAnimationTimer);
    id = id ? id.replace(/'/g, '') : '';	// strip any single quotes from id
    timeout = (typeof timeout === 'number') ? timeout * 1000 : 7000;

    _initQueue();

    const duplicateItem = window.top.busyQueue.findIndex(item => item.id === id);
    if (duplicateItem > -1) {
        window.top.busyQueue.splice(duplicateItem, 1);
        if (debug) console.debug(`busy item "${id}" already in queue!`);
    }

    // the queue is the master list controlling the busy animation
    window.top.busyQueue.push({
        id: id,
        expiry: Date.now() + timeout,
        modal: modal
    });

    _updateBusy();
    window.top.setTimeout(() => { stop(id); }, timeout);   // dequeue item after timeout
}




// stop loading animation
export function stop(id) {
    _initQueue();

    if (window.top.busyQueue.length) {
        id = id ? id.toString().replace(/'/g, '') : '';	// strip any single quotes from id
        let arrayIndex;

        // pop specified busy id off queue
        if (id) {
            arrayIndex = window.top.busyQueue.findIndex(busyItem => busyItem.id === id);
            if (arrayIndex > -1) {
                if (debug) console.debug(`busy item "${window.top.busyQueue[arrayIndex].id}" stopped!`);
                window.top.busyQueue.splice(arrayIndex, 1);
            }
        }

        // remove any expired item from the queue
        window.top.busyQueue.forEach(item => {
            if (item.expiry <= Date.now()) {
                arrayIndex = window.top.busyQueue.findIndex(busyItem => busyItem.id === item.id);
                if (arrayIndex > -1) {
                    if (debug) console.debug(`removing expired busy item "${window.top.busyQueue[arrayIndex].id}"`);
                    window.top.busyQueue.splice(arrayIndex, 1);
                }
            }
        })
    }

    _updateBusy();
}




// clear the busy queue and stop the busy animation
export function reset() {
    window.top.busyQueue = [];
    _updateBusy();
}



// debug the busy animation queue
export function status() {
    _initQueue();
    console.log('busy queue:', window.top.busyQueue);
}




////////////////////// SUPPORTING FUNCTIONS //////////////////////

function _initQueue() {
    if (typeof window.top.busyQueue !== 'object')
        window.top.busyQueue = [];
}



// monitor the queue and update the busy animation
function _updateBusy() {
    if (debug) console.debug(`_updateBusy() queue length: ${window.top.busyQueue.length}`);
    if (window.top.busyQueue.length === 0) {
        _fadeOutAnimation();
        _fadeOutModal();
    } else {
        _showAnimation(window.top.busyQueue[0].id);
        if (window.top.busyQueue.some(item => item.modal))
            _showModal()
        else
            _fadeOutModal();
    }
}


function _showAnimation(id) {
    window.top.clearTimeout(fadeoutAnimationTimer);

    // the busy animation is always on the root document
    busyAnimation = busyAnimation || window.top.document.body.querySelector('#animated-loader');

    // create busy animation elements if it doesn't exist (they can be hidden but never removed)
    if (busyAnimation === null) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'animated-loader-modal-overlay';
        window.top.document.body.appendChild(modalOverlay);

        busyAnimation = document.createElement('div');
        busyAnimation.id = 'animated-loader';
        busyAnimation.innerHTML = '<div><div><div><div><div><div><div><div><div><div></div></div></div></div></div></div></div></div></div>';
        window.top.document.body.appendChild(busyAnimation);
    }

    const topZ = _onTopZIndex().toString();
    busyAnimation.style.zIndex = topZ;
    modalOverlay.style.zIndex = topZ;
    busyAnimation.title = id;
    busyAnimation.style.display = 'block';
    busyAnimation.style.opacity = '1';
}

function _showModal() {
    window.top.clearTimeout(fadeoutModalTimer);
    modalOverlay.style.display = 'block';
    modalOverlay.style.opacity = '1';
}

function _fadeOutAnimation() {
    window.top.clearTimeout(fadeoutAnimationTimer);

    // fade out
    busyAnimation.style.opacity = '0';

    // then hide
    fadeoutAnimationTimer = window.top.setTimeout(() => {
        busyAnimation.style.display = 'none';
    }, 500);   // hide
}

function _fadeOutModal() {
    window.top.clearTimeout(fadeoutModalTimer);

    // fadeout
    modalOverlay.style.opacity = '0';

    // then hide
    fadeoutModalTimer = window.top.setTimeout(() => {
        modalOverlay.style.display = 'none';
    }, 500);   // hide
}




/** Get the highest z-index in the document.
 *
 * @returns {number}
 */
function _onTopZIndex() {
    let zTop = 0;
    const elements = document.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
        let zIndex = window.top.getComputedStyle(elements[i]).getPropertyValue('z-index');
        zIndex = isNaN(zIndex) ? 0 : parseInt(zIndex);
        if (zIndex && zIndex > zTop)
            zTop = zIndex;
    }

    return zTop;
}

