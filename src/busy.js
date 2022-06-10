/**
 * @fileOverview busy animation
 * @author Ananda Masri
 * @version 1.0.0
 */

const debug = false;

import './busy.styl';
import { onTopZIndex } from "@aamasri/dom-utils";

let $busyAnimation = false;
let $modalOverlay = false;
export const queue = [];



// start loading animation
export async function start(id, timeout=7, modal=false) {
    id = id ? id.replace(/'/g, '') : '';	// strip any single quotes from id
    timeout = (typeof timeout === 'number') ? timeout * 1000 : 7000;
    const expiry = Date.now() + timeout;

    queue.push({ id: id, expiry: expiry, modal: modal });     // allows matching id to be stopped

    if (!$busyAnimation) {
        // lazy load dependencies
        if (window.jQuery === undefined) {
            window.jQuery = await import(/* webpackChunkName: "jquery" */ 'jquery');
            window.jQuery = window.jQuery.default;
        }

        if (debug) console.debug('jQuery loaded', typeof window.jQuery);


        const isInIframe = window.location !== window.parent.location;		// detects whether we're in an iframe
        const $body = jQuery(isInIframe ? parent.document.body : document.body);

        // title for debugging only
        $modalOverlay = jQuery(`<div id="animated-loader-modal-overlay"></div>`).appendTo($body);
        $busyAnimation = jQuery(`<div id="animated-loader" title="${id}">
                                            <div>
                                                <div>
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <div>
                                                                    <div>
                                                                        <div>
                                                                            <div>
                                                                                <div></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`).appendTo($body);
    }

    $busyAnimation.stop().css('z-index', onTopZIndex()).fadeIn();

    if (modal)
        $modalOverlay.fadeTo('slow', 0.4);

    window.setTimeout(`busy.stop()`, timeout);   // dequeue
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
        $busyAnimation.stop().fadeOut('fast');		// stop the busy animation now that the server has responded
    }
}



function _hideModalOverlay() {
    if ($modalOverlay.css('display') === 'none')
        return;

    $modalOverlay.fadeOut('fast', function() {
        $modalOverlay.css('opacity', 0);
    });
}



// clear the busy queue and stop the busy animation
export function reset() {
    window.setTimeout(function() {
        queue.length = 0;
        if ($busyAnimation && $busyAnimation.length)
            $busyAnimation.stop().fadeOut('fast');
    }, 1000);
}




// debug the busy animation queue
export function status() {
    console.log('busy queue:', queue);
}


