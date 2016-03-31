/**
 * Created by matthias on 27.03.16.
 */



var news = {
    options: {
        apiURL: 'https://query.yahooapis.com/v1/public/yql',
        newsChangeInterval: 15 * 1000, //15sec
        newsUpdateInterval: 15 * 60 * 1000, //15min
        urls: []
    },

    data: [],
    changeInterval: null,

    init: function (options) {
        this.options = jQuery.extend({}, this.options, options);

        this.update();
        window.setInterval(news.update, news.options.newsUpdateInterval);
    },
    update: function () {
        $.ajax({
            url: news.options.apiURL,
            // The name of the callback parameter, as specified by the YQL service
            jsonp: "callback",
            // Tell jQuery we're expecting JSONP
            dataType: "jsonp",
            // Tell YQL what we want and that we want JSON
            data: {
                q: "select * from rss where url IN(\"" + news.options.urls.join('","') + "\")",
                format: "json"
            },

            // Work with the response
            success: news.onDataReceive
        });
    },
    onDataReceive: function (data) {
        news.data = data.query.results.item;
        news.data.sort(function (a, b) {
            var aDate = new Date(a.pubDate);
            var bDate = new Date(b.pubDate);
            if (aDate < bDate) {
                return 1;
            } else if (aDate > bDate) {
                return -1;
            }
            return 0;
        });

        news.changeNews();
        news.changeInterval = null;
        news.changeInterval = window.setInterval(news.changeNews, news.options.newsChangeInterval);
    },
    changeNews: function () {
        var current = news.data.shift();
        var div = $('#module-news');
        div.fadeOut('slow', function () {
            div.html(current.title);
            div.fadeIn('slow');
        });
        news.data.push(current);
    }
};
