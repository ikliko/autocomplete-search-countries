var Country = (function () {
    function Country(name, capital, flag) {
        this.name = name;
        this.capital = capital;
        this.flag = flag;
    }

    return Country;
}())

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
    }

    /**
     * Creates countries autocomplete wrappper element. This element wraps whole widget logic
     *
     * @returns {HTMLDivElement}
     */
    CountriesAutocomplete.prototype.createCountriesAutocompleteWrapper = function () {
        let countriesAutocompleteWrapper = document.createElement('div');
        countriesAutocompleteWrapper.classList.add('widget-countries-autocomplete-wrapper');
        countriesAutocompleteWrapper.setAttribute('data-uuid', this.uuid);

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

        return optionsWrapper;
    };

    /**
     * Generates UUID for the widget.
     */
    CountriesAutocomplete.prototype.generateUUID = function () {
        this.uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

    /**
     * This function is important for every widget. It's called by widget loader
     * and returns promise of widget wrapper element.
     *
     * @returns {Promise<unknown>}
     */
    CountriesAutocomplete.prototype.render = function () {
        return new Promise((resolve, reject) => {
            this.countriesAutocompleteWrapper.appendChild(this.renderInput());

            this.getAllCountries().then(countries => {
                let options = countries.slice();

                resolve(this.countriesAutocompleteWrapper);

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

        options.map(country => {
            let option = document.createElement('li'),
                flag = document.createElement('img'),
                countryRepresentorWrapper = document.createElement('div');

            flag.classList.add('country-flag');
            flag.src = country.flag;

            countryRepresentorWrapper.classList.add('country-representor-wrapper');
            countryRepresentorWrapper.append(`${country.name}, ${country.capital}`);

            option.append(flag);
            option.append(countryRepresentorWrapper);

            this.optionsWrapper.append(option);
        });

        if (!options.length) {
            this.optionsWrapper.innerHTML = 'No results';
        }

        this.countriesAutocompleteWrapper.append(this.optionsWrapper);
    };

    /**
     * Renders input and handles data manipulation with it
     *
     * @returns {HTMLInputElement}
     */
    CountriesAutocomplete.prototype.renderInput = function () {
        let countriesAutocompleteInput = document.createElement('input');
        countriesAutocompleteInput.classList.add('countries-autocomplete-input');
        countriesAutocompleteInput.placeholder = 'Search country..';
        let _self = this;

        countriesAutocompleteInput.addEventListener('focus', () => {
            this.optionsWrapper.classList.add('active');
        });

        countriesAutocompleteInput.addEventListener('blur', function () {
            if (!this.value) {
                _self.optionsWrapper.classList.remove('active');
            }
        });

        countriesAutocompleteInput.addEventListener('keypress', function (ev) {
            if ((/[^a-zA-Z]/gi).test(ev.key)) {
                ev.preventDefault();
            }
        });

        countriesAutocompleteInput.addEventListener('keyup', function (ev) {
            if (_self.inputState === this.value) {
                _self.inputState = this.value;
                _self.renderOptions(_self.searchCountries(this.value));
            }
        });

        return countriesAutocompleteInput;
    };

    /**
     * Makes REST API request and maps data to Country model
     *
     * @returns {PromiseLike<Array> | Promise<Array>}
     */
    CountriesAutocomplete.prototype.getAllCountries = function () {
        return RestRequester.get('https://restcountries.eu/rest/v2/all').then(countries => {
            this.allCountries = countries.map(country => new Country(country.name, country.capital, country.flag));

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
        return this.allCountries.filter(country => country.name.toLowerCase().includes(value));
    };

    return CountriesAutocomplete;
}());
