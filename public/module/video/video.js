/**
 * Created by matthias on 30.03.16.
 */


var video = {
    options: {
        selectorContainer: '#module-video',
        selectorVideoEle: '#video',
    },
    play: function (videoUrl, type) {

        var $videoEle = $(video.options.selectorVideoEle);
        $videoEle.html('<source src="' + videoUrl + '" type="' + type + '"/>')
        $videoEle[0].onended = function () {
            video.stop()
        };
        $videoEle[0].onplay = function () {
            $(video.options.selectorContainer).fadeIn();
        };
        $videoEle[0].load();
        $videoEle[0].play();


    },
    stop: function () {
        var $videoEle = $(video.options.selectorVideoEle);
        $videoEle[0].pause();
        $videoEle.html('');
        $(this.options.selectorContainer).fadeOut();
    }
};