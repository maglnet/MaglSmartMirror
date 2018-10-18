
var tankerkoenig = {
    options: {
        apiURL: 'https://creativecommons.tankerkoenig.de/json/prices.php',
        updateInterval: 10 * 60 * 1000 //10min
    },

    template: null,

    init: function (options) {
        this.options = jQuery.extend({}, this.options, options);

        $.get('module/tankerkoenig/tankerkoenig.mst', {async: false}, function (template) {
            tankerkoenig.template = template;
        });

        this.update();
        window.setInterval(tankerkoenig.update, tankerkoenig.options.updateInterval);
    },
    update: function () {
        var stationIds = [];
        $.each(tankerkoenig.options.stations, function (index, station){
            stationIds.push(index);
        });
        $.ajax({
            url: tankerkoenig.options.apiURL,
            method: "GET",
            dataType: "json",
            data: {
                ids: stationIds.join(','),
                apikey: tankerkoenig.options.apiKey
            },
            success: tankerkoenig.onDataReceive
        });
    },
    onDataReceive: function (data) {
        var stations = [];
        $.each(data.prices, function(index, value){
            var prices = [];
            $.each(value, function(valueIndex, detail){
                if(tankerkoenig.options.showTypes.length > 0 && $.inArray(valueIndex, tankerkoenig.options.showTypes) < 0) {
                    return;
                }
                prices.push({
                    type: valueIndex,
                    price: detail
                })
            });

            stations.push({
                id: index,
                stationInfo: tankerkoenig.options.stations[index],
                status: value.status,
                prices: prices
            });
        });

        var rendered = Mustache.render(tankerkoenig.template, {
            stations: stations
        });
        $('#module-tankerkoenig').html(rendered);
    }
};
