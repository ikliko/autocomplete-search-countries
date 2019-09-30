var RestRequester = (function () {
    function RestRequester() {
    }

    RestRequester.prototype.get = function (url, cb) {
        this.makeRequest('GET', url, true, cb);
    }

    RestRequester.prototype.makeRequest = function (method, url, async, cb) {
        if (cb && typeof cb === 'function') {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                try {
                    cb(JSON.parse(this.response))
                } catch (e) {

                }
            };
            xhttp.open(method, url, async);
            xhttp.send();

            return;
        }

        throw new Error('Invalid Callback function!' + (typeof cb))
    }

    return new RestRequester();
}())
