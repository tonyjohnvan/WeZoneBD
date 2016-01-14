$(function() {
    // show preloader
    $('#show_preloader_regular').click(function() {
        wezone_helpers.content_preloader_show('regular');
        setTimeout(function() {
            wezone_helpers.content_preloader_hide();
        },3000)
    });
    $('#show_preloader_md').click(function() {
        wezone_helpers.content_preloader_show();
        setTimeout(function() {
            wezone_helpers.content_preloader_hide();
        },3000)
    })
});