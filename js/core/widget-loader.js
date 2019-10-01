function ucfirst(string) {
    return string.replace(string[0], string[0].toUpperCase());
}

var WidgetLoader = (function () {
    function WidgetLoader() {
    }

    WidgetLoader.prototype.loadAllWidgets = function () {
        this.widgets = Selector('[data-widget-id="countries-autocomplete"]');
        this.widgets.forEach((elm) => {
            let widget = this.renderWidget(elm.dataset.widgetId);

            elm.appendChild(widget);
        })
    };

    WidgetLoader.prototype.renderWidget = function (widgetId) {
        return this.parseWidgetId(widgetId).render();
    };

    WidgetLoader.prototype.parseWidgetId = function (widgetId) {
        let widgetClassName = widgetId.split('-').map(widgetIdElm => ucfirst(widgetIdElm)).join('');

        if (window.hasOwnProperty(widgetClassName) && typeof window[widgetClassName] === 'function') {
            return new window[widgetClassName]();
        }

        return null;
    };

    return WidgetLoader;
}());
