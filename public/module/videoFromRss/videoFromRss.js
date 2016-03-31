var videoFromRss = {
    options: {
        apiURL: 'https://query.yahooapis.com/v1/public/yql'
    },
    play: function (rssFeedUri) {
        $.ajax({
            url: this.options.apiURL,
            // The name of the callback parameter, as specified by the YQL service
            jsonp: "callback",
            // Tell jQuery we're expecting JSONP
            dataType: "jsonp",
            // Tell YQL what we want and that we want JSON
            data: {
                q: "select * from rss where url = \"" + rssFeedUri + "\"",
                format: "json"
            },

            // Work with the response
            success: function (data) {
                var item = data.query.results.item;
                if ($.isArray(item)) {
                    item = item[0];
                }
                video.play(item.enclosure.url, item.enclosure.type)
            }
        });
    }
};