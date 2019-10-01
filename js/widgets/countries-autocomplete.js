var CountriesAutocomplete = (function () {
    function CountriesAutocomplete() {
        this.options = [];
        this.getAllCountries()
    }

    CountriesAutocomplete.prototype.render = function () {
        let countriesAutocompleteWrapper = document.createElement('div');
        countriesAutocompleteWrapper.classList.add('widget-countries-autocomplete-wrapper');
        countriesAutocompleteWrapper.appendChild(this.renderInput());

        // `
        // <div class="widget-countries-autocomplete-wrapper">
        //     // ${this.renderInput()}
        //     //
        //     // ${this.renderDropdownMenu()}
        // </div>
        // `;

        return countriesAutocompleteWrapper;
    };

    CountriesAutocomplete.prototype.renderInput = function () {
        let countriesAutocompleteInput = document.createElement('input');
        countriesAutocompleteInput.classList.add('countries-autocomplete-input');

        return countriesAutocompleteInput;
    };

    CountriesAutocomplete.prototype.renderDropdownMenu = function () {
        if (!this.options.length) {
            return '';
        }
        console.log(235);

        let a = this.options.map((option) => this.renderOption(option)).join('');


        return `
            <ul>
                
            </ul>
        `;
    };

    CountriesAutocomplete.prototype.renderOption = function (option) {
        console.log(123);
        return '<li>hello</li>';
    }

    CountriesAutocomplete.prototype.getAllCountries = function () {
        RestRequester.get('https://restcountries.eu/rest/v2/all', (countries) => {
            this.options = countries;

            this.render();
        });
    };

    return CountriesAutocomplete;
}())
