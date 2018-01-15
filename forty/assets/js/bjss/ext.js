/*
 * ext.js - encapsulates the fetching of currencies and currency conversion
 * 
 * Relies on jquery (ajax).
 * Relies upon ES6 Promises (will not work in Internet Explorer unless using bluebird.js).
 * 
 * Example urls: http://apilayer.net/api/list?access_key=41607a8f5f4f41bab7fd6a19893bb4fd
 */

 export default class Extra {
    constructor() {
        this._jsonRatesUrl = 'http://jsonrates.com/';
        this._accessKey = '41607a8f5f4f41bab7fd6a19893bb4fd';
    }

    /* properties */

    /* methods */

    // returns list of currencies, as fetched from from jsonRates
    //  => using Promise
    currencyList() {
        var thisExt = this;
        return new Promise(function(resolve, reject) {
            // a simple GET to retrieve JSON
            $.ajax({
                url: 'http://apilayer.net/api/list?access_key=' + thisExt._accessKey,
                type: "get",
                contentType: false,
                dataType: "json",
                processData: false,
                cache: false,
                success: function(data) {
                    resolve(data.currencies);
                },
                error: function (jqXHR, exception) {
                    reject(exception);
                }
            });
        });
    }

    // returns the converted value from GBP to the given currency
    // => using Promise
    // Note - when providing "source" parameter to API request,
    //  got the response "- Your current Subscription Plan does not support Source Currency Switching."
    // Instead, using a rough calculation based on the USD as default currency by:
    //  1. Get three currencies (USD - default, plus the source currency of GBP and the target currency, e.g. EUR)
    //  2. Convert the GBP value to USD value, using "USDGBP"
    //  3. Then convert from USD to the target currency using "USB[target currency]"
    // Or more simply, divide the Target Rate by the GBP rate, and multiple the value.
    convertToCurrency(value, currency) {
        var thisExt = this;
        console.log("Inside convertToCurrency");

        // TODO: improve error handling here
        if (currency.length != 3 ||
            value < 0) {
            console.log("Unexpected parameters");
            return null;

        } else {
            return new Promise(function(resolve, reject) {
                // a simple GET to retrieve JSON
                var fetchCurrencies = 'USD,GBP,' + currency;
                var fetchUrl = 'http://apilayer.net/api/live?access_key=' + thisExt._accessKey + '&currencies=' + escape(fetchCurrencies);
                console.log("Fetching: " + fetchUrl);
                $.ajax({
                    url: fetchUrl,
                    type: "get",
                    contentType: false,
                    dataType: "json",
                    processData: false,
                    cache: false,
                    success: function(data) {
                        // TODO: Improve error handling here too
                        if (data.quotes) {
                            var fromGBPtoUSDrate = Number(data.quotes['USDGBP']);
                            var fromUSDtoTargetRate = Number(data.quotes['USD'+currency]);
                            var targetExchangeRate = fromUSDtoTargetRate / fromGBPtoUSDrate;

                            resolve(value*targetExchangeRate);                            
                        } else {
                            reject("Missing quotes");
                        }
                    },
                    error: function (jqXHR, exception) {
                        reject(exception);
                    }
                });
            });
        }
    }
 };


 