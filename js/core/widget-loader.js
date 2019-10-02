/**
 * Makes first letter of string uppercase
 *
 * @param string
 * @returns {void}
 */
function ucfirst(string) {
    return string.replace(string[0], string[0].toUpperCase());
}

var WidgetLoader = (function () {
    function WidgetLoader() {
    }

    /**
     * Loads all widgets on page automatically
     */
    WidgetLoader.prototype.loadAllWidgets = function () {
        this.widgets = Selector('[data-widget-id="countries-autocomplete"]');
        this.widgets.forEach((elm) => {
            let widget = this.renderWidget(elm.dataset.widgetId).then(response => {
                elm.appendChild(response);
            });
        })
    };

    /**
     * Calls render function of all widgets
     *
     * @param widgetId
     * @returns {Promise<unknown>}
     */
    WidgetLoader.prototype.renderWidget = function (widgetId) {
        return this.parseWidgetId(widgetId).render();
    };

    /**
     * Parses widget id to widget class name and makes instance of it
     *
     * @param widgetId
     * @returns {null}
     */
    WidgetLoader.prototype.parseWidgetId = function (widgetId) {
        let widgetClassName = widgetId.split('-').map(widgetIdElm => ucfirst(widgetIdElm)).join('');

        if (window.hasOwnProperty(widgetClassName) && typeof window[widgetClassName] === 'function') {
            return new window[widgetClassName]();
        }

        return null;
    };

    return WidgetLoader;
}());
