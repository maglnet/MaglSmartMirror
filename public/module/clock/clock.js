/**
 * Created by matthias on 22.03.16.
 */

var clock = {
    options: {
        selector: '#module-clock',
        template: 'module/clock/clock.mst',
        dateFormat: "dddd, LL",
        timeFormat: "HH:mm",
        updateInterval: 5000
    },
    interval: null,
    template: null,

    init: function (options) {
        clock.options = jQuery.extend({}, this.options, options);

        $.get(clock.options.template, function (template) {
            clock.template = template;
            clock.interval = window.setInterval(clock.update, clock.options.updateInterval);
            clock.update();
        });
    },
    update: function () {
        var element = $(clock.options.selector);
        var rendered = Mustache.render(clock.template, {
            date: moment().format(clock.options.dateFormat),
            time: moment().format(clock.options.timeFormat)
        });
        if (rendered != element.html()) {
            element.html(rendered);
        }
    }
};