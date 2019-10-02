var RestRequester = (function () {
    function RestRequester() {
    }

    /**
     * Makes get request to given url
     *
     * @param url
     * @returns {Promise<unknown>}
     */
    RestRequester.prototype.get = function (url) {
        return this.makeRequest('GET', url, true);
    };

    RestRequester.prototype.makeRequest = function (method, url, async) {
        return new Promise(((resolve, reject) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function (ev) {
                if (this.status >= 200 && this.status <= 299 && this.readyState === XMLHttpRequest.DONE) {
                    try {
                        resolve(JSON.parse(this.responseText));
                    } catch (e) {
                        reject(e)
                    }
                }
            };
            xhttp.open(method, url, async);
            xhttp.send();
        }));
    };

    return new RestRequester();
}());
