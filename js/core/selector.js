/**
 * This library is like jQuery selection and loop
 *
 * @type {function(*=): Selector}
 */
var Selector = (function () {
    'use strict';

    /**+
     * Makes DOM selection by given selector.
     *
     * @param selector
     * @constructor
     */
    function Selector(selector) {
        this.elements = document.querySelectorAll('[data-widget-id="countries-autocomplete"]');
    }

    /**
     * foreach function for selector elements
     *
     * @param cb
     * @returns {Selector}
     */
    Selector.prototype.forEach = function (cb) {
        if (cb && typeof cb === 'function') {
            for (let i = 0; i < this.elements.length; i++) {
                cb(this.elements[i], i);
            }

            return this;
        }

        throw new Error('Invalid callback given for foreach!');
    }

    return function (selector) {
        return new Selector(selector)
    };
}())
