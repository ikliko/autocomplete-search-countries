var Selector = (function () {
    'use strict';

    function Selector(selector) {
        this.elements = document.querySelectorAll('[data-widget-id="countries-autocomplete"]');
    }

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
