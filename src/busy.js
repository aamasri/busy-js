/**
 * @fileOverview busy animation
 */

const debug = false;

import './busy.styl';

let busyAnimation = null;
let modalUnderlay = null;
let fadeoutAnimationTimer;
let fadeoutModalTimer;



// start loading animation
export function start(id, timeout=7, modal=false) {
    window.clearTimeout(fadeoutAnimationTimer);
    id = id ? id.replace(/'/g, '') : '';	// strip any single quotes from id
    timeout = (typeof timeout === 'number') ? timeout * 1000 : 7000;

    _initQueue();

    const duplicateItem = window.busyQueue.findIndex(item => item.id === id);
    if (duplicateItem > -1) {
        window.busyQueue.splice(duplicateItem, 1);
        if (debug) console.debug(`busy item "${id}" already in queue!`);
    }

    // the queue is the master list controlling the busy animation
    window.busyQueue.push({
        id: id,
        expiry: Date.now() + timeout,
        modal: modal
    });

    _updateBusy();
    window.setTimeout(() => { stop(id); }, timeout);   // dequeue item after timeout
}




// stop loading animation
export function stop(id) {
    _initQueue();

    if (window.busyQueue.length) {
        id = id ? id.toString().replace(/'/g, '') : '';	// strip any single quotes from id
        let arrayIndex;

        // pop specified busy id off queue
        if (id) {
            arrayIndex = window.busyQueue.findIndex(busyItem => busyItem.id === id);
            if (arrayIndex > -1) {
                if (debug) console.debug(`busy item "${window.busyQueue[arrayIndex].id}" stopped!`);
                window.busyQueue.splice(arrayIndex, 1);
            }
        }

        // remove any expired item from the queue
        window.busyQueue.forEach(item => {
            if (item.expiry <= Date.now()) {
                arrayIndex = window.busyQueue.findIndex(busyItem => busyItem.id === item.id);
                if (arrayIndex > -1) {
                    if (debug) console.debug(`removing expired busy item "${window.busyQueue[arrayIndex].id}"`);
                    window.busyQueue.splice(arrayIndex, 1);
                }
            }
        })
    }

    _updateBusy();
}




// clear the busy queue and stop the busy animation
export function reset() {
    window.busyQueue = [];
    _updateBusy();
}



// debug the busy animation queue
export function status() {
    _initQueue();
    console.log('busy queue:', window.busyQueue);
}




////////////////////// SUPPORTING FUNCTIONS //////////////////////

function _elementExists(el) {
    return (typeof el !== 'undefined' && (el instanceof Element));
}


function _initQueue() {
    if (typeof window.busyQueue !== 'object')
        window.busyQueue = [];
}


// monitor the queue and update the busy animation
function _updateBusy() {
    if (debug) console.debug(`_updateBusy() queue length: ${window.busyQueue.length}`);
    if (window.busyQueue.length === 0) {
        _fadeOutAnimation();
        _fadeOutModal();
    } else {
        _showAnimation(window.busyQueue[0].id);
        if (window.busyQueue.some(item => item.modal))
            _showModal()
        else
            _fadeOutModal();
    }
}


function _showAnimation(id) {
    window.clearTimeout(fadeoutAnimationTimer);

    // create the busy animation and modal underlay if it doesn't exist
    if (!_elementExists(modalUnderlay)) {
        modalUnderlay = window.document.body.querySelector('#animated-loader-modal-underlay');
        if (modalUnderlay === null) {
            modalUnderlay = window.document.createElement('div');
            modalUnderlay.id = 'animated-loader-modal-underlay';
            window.document.body.appendChild(modalUnderlay);
        }
    }

    if (!_elementExists(busyAnimation)) {
        busyAnimation = window.document.body.querySelector('#animated-loader');
        if (busyAnimation === null) {
            busyAnimation = window.document.createElement('div');
            busyAnimation.id = 'animated-loader';
            busyAnimation.innerHTML = '<div><div><div><div><div><div><div><div><div><div></div></div></div></div></div></div></div></div></div>';
            window.document.body.appendChild(busyAnimation);
        }
    }

    const topZ = _onTopZIndex().toString();
    busyAnimation.style.zIndex = topZ;
    modalUnderlay.style.zIndex = topZ;
    busyAnimation.title = id;
    busyAnimation.style.display = 'block';
    busyAnimation.style.opacity = '1';
}

function _showModal() {
    window.clearTimeout(fadeoutModalTimer);
    if (_elementExists(modalUnderlay)) {
        modalUnderlay.style.display = 'block';
        modalUnderlay.style.opacity = '1';
    }
}

function _fadeOutAnimation() {
    window.clearTimeout(fadeoutAnimationTimer);

    // fade out
    if (_elementExists(busyAnimation))
        busyAnimation.style.opacity = '0';

    // then hide
    fadeoutAnimationTimer = window.setTimeout(() => {
        if (_elementExists(busyAnimation))
            busyAnimation.style.display = 'none';
    }, 500);   // hide
}

function _fadeOutModal() {
    window.clearTimeout(fadeoutModalTimer);

    // fadeout
    if (_elementExists(modalUnderlay))
        modalUnderlay.style.opacity = '0';

    // then hide
    fadeoutModalTimer = window.setTimeout(() => {
        if (_elementExists(modalUnderlay))
            modalUnderlay.style.display = 'none';
    }, 500);   // hide
}




/** Get the highest z-index in the document.
 *
 * @returns {number}
 */
function _onTopZIndex() {
    let zTop = 0;
    const elements = window.document.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
        let zIndex = window.getComputedStyle(elements[i]).getPropertyValue('z-index');
        zIndex = isNaN(zIndex) ? 0 : parseInt(zIndex);
        if (zIndex && zIndex > zTop)
            zTop = zIndex;
    }

    return zTop;
}