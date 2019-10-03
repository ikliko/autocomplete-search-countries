var Country = (function () {
    function Country(name, capital, flag, code) {
        this.name = name;
        this.capital = capital;
        this.flag = flag;
        this.code = code;
    }

    return Country;
}());

const KEYS = {
    ARROW_UP: 'arrowup',
    ARROW_DOWN: 'arrowdown',
    ENTER: 'enter',
};

var CountriesAutocomplete = (function () {
    function CountriesAutocomplete() {
        /**
         * Countries container that keeps all countries
         *
         * @type {Array}
         */
        this.allCountries = [];

        /**
         * UUID (Universally Unique IDentifier) placeholder of current widget state.
         *
         * @type {string}
         */
        this.uuid = '';
        this.generateUUID();

        this.widgetWrapper = this.createWidgetWrapper();

        /**
         * Countries autocomplete wrapper element field
         *
         * @type {HTMLDivElement}
         */
        this.countriesAutocompleteWrapper = this.createCountriesAutocompleteWrapper();

        /**
         * Options wrapper element field
         *
         * @type {HTMLUListElement}
         */
        this.optionsWrapper = this.createOptionsWrapper();

        /**
         * This field is storage for input state
         *
         * @type {string}
         */
        this.inputState = '';

        /**
         * Selected country code
         *
         * @type {number}
         */
        this.selectedCountryCode = '';

        /**
         * Current country code
         *
         * @type {string}
         */
        this.userSelectedCountryCode = '';

        this.selectedCountryWrapper = this.createSelectedCountryWrapper();
    }

    CountriesAutocomplete.prototype.createWidgetWrapper = function () {
        let widgetWrapper = document.createElement('div');
        widgetWrapper.classList.add('widget-countries-autocomplete-wrapper');
        widgetWrapper.setAttribute('data-uuid', this.uuid);

        return widgetWrapper;
    }

    /**
     * Creates countries autocomplete wrappper element. This element wraps whole widget logic
     *
     * @returns {HTMLDivElement}
     */
    CountriesAutocomplete.prototype.createCountriesAutocompleteWrapper = function () {
        let countriesAutocompleteWrapper = document.createElement('div');
        countriesAutocompleteWrapper.classList.add('autocomplete-wrapper');

        return countriesAutocompleteWrapper;
    };

    /**
     * Creates options wrapper element
     *
     * @returns {HTMLUListElement}
     */
    CountriesAutocomplete.prototype.createOptionsWrapper = function () {
        let optionsWrapper = document.createElement('ul');
        optionsWrapper.setAttribute('data-role', 'options-container');
        let _self = this;

        optionsWrapper.addEventListener('mouseover', function (ev) {
            if (ev.target.tagName === 'LI') {
                if (this.querySelector('.active')) {
                    this.querySelector('.active').classList.remove('active');
                }

                let hoveredLi = ev.target.closest('li');
                hoveredLi.classList.add('active');
                _self.selectedCountryCode = hoveredLi.dataset['id']
            }
        });

        optionsWrapper.addEventListener('mouseleave', () => {
            this.selectCountryByCode(this.selectedCountryCode);
        });

        optionsWrapper.addEventListener('mousedown', function (ev) {
            if (ev.target.tagName === 'UL') {
                return;
            }

            if (this.querySelector('.active')) {
                this.querySelector('.active').classList.remove('active');
            }

            ev.target.closest('li').classList.add('active');
            _self.userSelectedCountryCode = ev.target.closest('li').dataset['id'];
            _self.renderSelectedOption();
            _self.toggleAutocomplete();
        });

        return optionsWrapper;
    };

    CountriesAutocomplete.prototype.createSelectedCountryWrapper = function () {
        let div = document.createElement('div'),
            spanText = document.createElement('span');
        div.setAttribute('data-role', 'selected-value-wrapper');
        spanText.append('Select country');
        div.append(spanText);

        div.addEventListener('mousedown', () => {
            this.toggleAutocomplete();
        });

        return div;
    };

    CountriesAutocomplete.prototype.showAutocomplete = function () {
        this.countriesAutocompleteWrapper.style.display = 'flex';
        this.focusInput();
    };

    CountriesAutocomplete.prototype.hideAutocomplete = function () {
        this.countriesAutocompleteWrapper.style.display = 'none';
    };

    CountriesAutocomplete.prototype.toggleAutocomplete = function () {
        if (this.countriesAutocompleteWrapper.style.display === 'flex') {
            this.hideAutocomplete();
        } else {
            this.showAutocomplete();
        }
    };

    CountriesAutocomplete.prototype.focusInput = function () {
        setTimeout(() => {
            this.countriesAutocompleteWrapper.querySelector('input').focus()
        })
    }

    CountriesAutocomplete.prototype.renderSelectedOption = function () {
        let countryElement = this.createOptionElement(this.getCurrentCountry(), false).innerHTML;
        this.selectedCountryWrapper.innerHTML = '';
        this.selectedCountryWrapper.innerHTML = countryElement;
    };

    CountriesAutocomplete.prototype.getCurrentCountry = function () {
        return this.allCountries.find(country => country.code === this.userSelectedCountryCode);
    };

    /**
     * Generates UUID for the widget.
     */
    CountriesAutocomplete.prototype.generateUUID = function () {
        this.uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

    CountriesAutocomplete.prototype.selectCountryByCode = function (code) {
        if (this.optionsWrapper.querySelector('.active')) {
            this.optionsWrapper.querySelector('.active').classList.remove('active');
        }

        setTimeout(() => {
            this.optionsWrapper.querySelector(`[data-id="${code}"]`).classList.add('active');
            let pos = this.optionsWrapper.querySelector(`[data-id="${code}"]`).offsetTop;

            if (pos > 200) {
                this.optionsWrapper.scrollTo({
                    top: pos - 150,
                    behavior: "smooth"
                });
            } else {
                this.optionsWrapper.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        })
    };

    /**
     * This function is important for every widget. It's called by widget loader
     * and returns promise of widget wrapper element.
     *
     * @returns {Promise<unknown>}
     */
    CountriesAutocomplete.prototype.render = function () {
        return new Promise((resolve, reject) => {
            this.widgetWrapper.appendChild(this.selectedCountryWrapper);
            this.countriesAutocompleteWrapper.appendChild(this.renderInput());

            this.getAllCountries().then(countries => {
                let options = countries.slice();

                this.widgetWrapper.append(this.countriesAutocompleteWrapper);
                resolve(this.widgetWrapper);

                this.renderOptions(options);
            })
        });
    };

    /**
     * Renders options
     *
     * @param options
     */
    CountriesAutocomplete.prototype.renderOptions = function (options) {
        this.optionsWrapper.innerHTML = '';

        options.map((country, index) => {
            this.optionsWrapper.append(this.createOptionElement(country, !index));
        });

        if (!options.length) {
            this.optionsWrapper.innerHTML = 'No results';
        }

        this.countriesAutocompleteWrapper.append(this.optionsWrapper);
    };

    CountriesAutocomplete.prototype.createOptionElement = function (country, active) {
        let option = document.createElement('li'),
            flag = document.createElement('img'),
            countryRepresentorWrapper = document.createElement('div');

        option.setAttribute('data-id', country.code);

        if (active) {
            option.classList.add('active');
            this.selectedCountryCode = country.code;
        }

        flag.classList.add('country-flag');
        flag.src = country.flag;

        countryRepresentorWrapper.classList.add('country-representor-wrapper');

        let countryCapital = [country.name, country.capital].filter(field => field).join(', ');
        countryRepresentorWrapper.append(`${countryCapital}`);

        option.append(flag);
        option.append(countryRepresentorWrapper);

        return option;
    };

    /**
     * Renders input and handles data manipulation with it
     *
     * @returns {HTMLInputElement}
     */
    CountriesAutocomplete.prototype.renderInput = function () {
        let countriesAutocompleteInput = document.createElement('input');
        countriesAutocompleteInput.classList.add('countries-autocomplete-input');
        countriesAutocompleteInput.placeholder = 'Type country name (Ex.: Bulgaria)..';
        let _self = this;

        /**
         * Hides select if user clicks outside input and input have no value
         */
        countriesAutocompleteInput.addEventListener('blur', function () {
            if (!this.value) {
                _self.hideAutocomplete();
            }
        });

        /**
         * Validates input value. Filters all non alphabet chars.
         */
        countriesAutocompleteInput.addEventListener('keypress', function (ev) {
            if ((/[^a-zA-Z]/gi).test(ev.key)) {
                ev.preventDefault();
            }
        }, true);

        /**
         * Searching countries on type
         */
        countriesAutocompleteInput.addEventListener('keyup', function (ev) {
            _self.checkCommandKey(ev.key.toLowerCase());

            if (_self.inputState !== this.value) {
                _self.inputState = this.value;

                /**
                 * search options in array
                 */
                // _self.renderOptions(_self.searchCountries(this.value));

                /**
                 * Search countries async to REST API
                 */
                if (this.value !== '') {
                    _self.searchCountriesAsync(this.value).then(countries => {
                        _self.renderOptions(countries);
                    });
                } else {
                    _self.getAllCountries().then(countries => {
                        _self.renderOptions(countries);
                    });
                }
            }
        });

        return countriesAutocompleteInput;
    };

    CountriesAutocomplete.prototype.checkCommandKey = function (key) {
        switch (key.toLowerCase()) {
            case KEYS.ARROW_UP:
                this.moveSelectUp();
                break;
            case KEYS.ARROW_DOWN:
                this.moveSelectDown();
                break;
            case KEYS.ENTER:
                this.userSelectedCountryCode = this.selectedCountryCode;
                this.renderSelectedOption();
                this.toggleAutocomplete();
                break;
        }
    };

    CountriesAutocomplete.prototype.moveSelectUp = function () {
        let currentIndex = this.allCountries.findIndex(country => country.code === this.selectedCountryCode),
            nextIndex = currentIndex - 1;

        if (nextIndex === -1) {
            nextIndex = this.allCountries.length - 1;
        }

        this.selectedCountryCode = this.allCountries[nextIndex].code;
        this.selectCountryByCode(this.selectedCountryCode);
    };

    CountriesAutocomplete.prototype.moveSelectDown = function () {
        let currentIndex = this.allCountries.findIndex(country => country.code === this.selectedCountryCode),
            nextIndex = currentIndex + 1;

        if (nextIndex === this.allCountries.length) {
            nextIndex = 0;
        }

        this.selectedCountryCode = this.allCountries[nextIndex].code;
        this.selectCountryByCode(this.selectedCountryCode);
    };

    /**
     * Makes REST API request and maps data to Country model
     *
     * @returns {PromiseLike<Array> | Promise<Array>}
     */
    CountriesAutocomplete.prototype.getAllCountries = function () {
        return RestRequester.get('https://restcountries.eu/rest/v2/all').then(countries => {
            this.allCountries = countries.map(country => new Country(country.name, country.capital, country.flag, country.alpha2Code));

            return this.allCountries;
        }, error => {
            console.error(error);
        });
    };

    /**
     * Filters countries container by given value
     *
     * @param value
     *
     * @returns {*[]}
     */
    CountriesAutocomplete.prototype.searchCountries = function (value) {
        return this.allCountries.filter(country => country.name.toLowerCase().includes(value)
            || country.capital.toLowerCase().includes(value));
    };

    /**
     * Makes request to REST API by given string
     *
     * @param value
     * @returns {Promise<Array>}
     */
    CountriesAutocomplete.prototype.searchCountriesAsync = function (value) {
        return RestRequester.get(`https://restcountries.eu/rest/v2/name/${value}`).then(countries => {
            this.allCountries = countries.map(country => new Country(country.name, country.capital, country.flag, country.alpha2Code));

            return this.allCountries;
        }, error => {
            console.error(error);
        })
    };

    return CountriesAutocomplete;
}());
