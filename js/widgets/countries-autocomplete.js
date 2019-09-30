var CountriesAutocomplete = (function () {
    function CountriesAutocomplete() {
        this.options = [];
        this.getAllCountries()
    }

    CountriesAutocomplete.prototype.render = function () {
        return `
        <div class="widget-countries-autocomplete-wrapper">
            ${this.renderInput()}
            
            ${this.renderDropdownMenu()}
        </div>
        `;
    };

    CountriesAutocomplete.prototype.renderInput = function () {
        return `        
            <input type="text" class="countries-autocomplete-input">
        `;
    };

    CountriesAutocomplete.prototype.renderDropdownMenu = function () {
        console.log(235);
        return `
            <ul>
                ${this.options.map((option) => this.renderOption(option))}
            </ul>
        `;
    };

    CountriesAutocomplete.prototype.renderOption = function(option) {
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
