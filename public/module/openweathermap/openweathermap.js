/**
 * Created by matthias on 22.03.16.
 */


var openweathermap = {
    options: {
        id: 2925533,
        apiKey: "",
        units: "metric",
        updateInterval: 15 * 60 * 1000, // 15min
        current: {
            enabled: true,
            selector: "#module-openweathermap",
            template: 'module/openweathermap/current.mst',
        },
        forecast: {
            enabled: true,
            selector: "#module-openweathermap-forecast",
            template: "module/openweathermap/forecast.mst",
        }
    },
    templateCurrent: null,
    templateForecast: null,
    interval: null,
    init: function (options) {
        this.options = jQuery.extend({}, this.options, options);
        $.get(openweathermap.options.current.template, {async: false}, function (template) {
            openweathermap.templateCurrent = template;
        });
        if (openweathermap.options.forecast.enabled) {
            $.get(openweathermap.options.forecast.template, {async: false}, function (template) {
                openweathermap.templateForecast = template;
            });
        }
        openweathermap.interval = window.setInterval(openweathermap.update, openweathermap.options.updateInterval);
        openweathermap.update();
    },
    data: {
        current: null,
        forecast: null
    },
    update: function () {
        if (openweathermap.options.current.enabled) {
            $.get("http://api.openweathermap.org/data/2.5/weather", {
                units: openweathermap.options.units,
                appid: openweathermap.options.apiKey,
                id: openweathermap.options.id
            }, function (owmData) {
                openweathermap.data.current = owmData;
                openweathermap.renderCurrent();
            });
        }

        if (openweathermap.options.forecast) {
            $.get("http://api.openweathermap.org/data/2.5/forecast/daily", {
                units: openweathermap.options.units,
                appid: openweathermap.options.apiKey,
                id: openweathermap.options.id
            }, function (owmData) {
                openweathermap.data.forecast = owmData;
                openweathermap.renderForecast();
            });
        }


    },
    renderCurrent: function () {
        owmData = openweathermap.data.current;
        var rendered = Mustache.render(openweathermap.templateCurrent, {
            current: {
                temp: owmData.main.temp.toFixed(1),
                tempMin: owmData.main.temp_min.toFixed(1),
                tempMax: owmData.main.temp_max.toFixed(1),
                sunrise: moment(owmData.sys.sunrise, 'X').format('H:mm'),
                sunset: moment(owmData.sys.sunset, 'X').format('H:mm'),
                dayNight: function () {
                    return owmData.dt >= owmData.sys.sunrise && owmData.dt <= owmData.sys.sunset ? 'day' : 'night';
                },
                raw: owmData
            }
        });
        $(openweathermap.options.current.selector).html(rendered);
    },
    renderForecast: function () {
        owmData = openweathermap.data.forecast;
        var data = [];
        $(owmData.list).each(function (index, object) {
            // dt is always 12AM, so only add if it is in future
            if (object.dt > Math.floor((Date.now() / 1000) - 60 * 60 * 12)) {
                data.push(object);
            }
        });
        var rendered = Mustache.render(openweathermap.templateForecast, {
            forecast: {
                list: data,
                raw: owmData
            },
            dayName: function () {
                return function (num, render) {
                    return moment(render(num), 'X').format('dd');
                }
            },
            round: function () {
                return function (num, render) {
                    return Math.round(parseFloat(render(num)));
                }
            }
        });
        $(openweathermap.options.forecast.selector).html(rendered);
    }
};