/**
 * Created by matthias on 21.03.16.
 */

var loadModules = function (config) {

    moment.locale(config.locale);

    $(config._modules).each(function (index, element) {

        $.ajax({
            url: 'module/' + element + '/' + element + '.js',
            dataType: "script",
            success: function(data) {
                var module = window[element];
                if (!module) {
                    console.error('cannot find module: ' + element);
                    return;
                }

                var moduleConfig = config[element];

                try {
                    module.init(moduleConfig);
                } catch (error) {
                    console.log('unable to initialize module "' + element + '": ' + error);
                    console.log('it\'s possible, that the module does not need to be initialized');
                }
            }
        });

    });

};

$(function () {

    //load config
    $.ajax("js/config.json", {
        // Work with the response
        error: function (request, status, error) {
            $.ajax("js/config.dist.json", {
                // Work with the response
                error: function (request, status, error) {
                    console.log('no, config? WTF?')
                },
                success: loadModules
            });
        },
        success: loadModules
    });

    if (annyang) {
        // Let's define a command.
        var commands = {
            'radio': function () {
                var audioEle = $('#audio');
                audioEle.html('<source src="http://hr-mp3-m-h3.akacast.akamaistream.net/7/785/142133/v1/gnl.akacast.akamaistream.net/hr-mp3-m-h3" type="audio/mpeg">');
                audioEle[0].load();
                audioEle[0].play();
            },
            'news': function () {
                videoFromRss.play('http://www.tagesschau.de/export/video-podcast/webl/tagesschau-in-100-sekunden/')
            },
            'stop': function () {
                video.stop();

                var audioEle = $('#audio');
                audioEle.html('<source src="" type="">');
                audioEle[0].pause();
                audioEle[0].load();
            }
        };

        // Add our commands to annyang
        annyang.addCommands(commands);

        // Start listening.
        annyang.start();
        annyang.debug(true);
    }

});
