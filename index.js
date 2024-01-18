$.fn.tabbify = function(devSettings){
    // Merging the defatult settings with parameter
    let myConf = $.extend({}, $.fn.tabbify.defaults, devSettings);
    console.log('Default Settigs', $.fn.tabbify.defaults);
    console.log('Settings from parameter: ', devSettings);
    console.log('Merged Settings: ', myConf);

    // this - refers to DOM element returned by the selector.
    // When a selector is executed, it always returns an arry containing one or more DOM elements
    // In order to return the chain back to jQuery, we must return 'this' object
    // Based on 2nd statement, we need to ideally return this.each, so every DOM chain is returned.
    return this.each(function() {

        $.fn.tabbify.init();
        
    });
}

$.fn.tabbify.defaults = {
    enableBookmark: true,
    enableTabStorage: false
}

$.fn.tabbify.init = function() {
    $.fn.tabbify.bindEvent();
    $.fn.tabbify.restoreTab();
}

/*
    @function: updateUI
    @param: null
    @returns: null
    @description: update the UI on every click.
*/
$.fn.tabbify.updateUI = function($currentTab) {
    // Show/hide applicable content
    let hash = $currentTab.attr('href')
    let $activContent = $(hash);
    $activContent.siblings()
                    .hide() // Hide siblings or other contents
                .end() // Get back to previous DOM element(s)
                    .show(); // Show it

                    // Update active tab
    
    $currentTab.addClass('active')
                .parent().siblings() //li
                .find('a') // anchors
                    .removeClass('active');
    
    $.fn.tabbify.saveState(hash);
}

/*
    @function: fetchContent
    @param: $tab
    @returns: null
    @description: fetching the content dynmanically using AJAX.
*/
$.fn.tabbify.fetchContent = function($tab) {
    let $activContent = $($tab.attr('href'));
    let errorCodes = {
        404: 'Something went wrong! Please try again later.',
        401: 'You need to login.',
        500: 'Something went wrong! Please try again later.',
    }
    if($tab.attr('data-href') && ($tab.attr('data-href') !== '')) { // a bit of null check on AJAX URL
        $.ajax({
            url: $tab.attr('data-href'),
            type: 'GET',
            dataType: 'text',
        }).done(function (response) {
            $activContent.html(response);
        }).fail(function (xhr, status, error) {
            $activContent.html(errorCodes[xhr.status] || 'Something went wrong! Try again');
        }).always(function(){
            $.fn.tabbify.updateUI($tab);
        });
    } else {
        $.fn.tabbify.updateUI($tab);
    }
}

/*
    @function: saveState
    @param: null
    @returns: null
    @description: store the updated UI on different actions .
*/

$.fn.tabbify.saveState = function(hash){
    localStorage.setItem('hash', hash);
}


/*
    @function: bindEvent
    @param: null
    @returns: null
    @description: Bind the events on tabs.
*/
$.fn.tabbify.bindEvent = function() {
    let selectors = {
        tabNav: $('.tab-nav'),
        tabContent: $('.tab-content')
    };
    selectors.tabNav.find('a').each(function bindingClickOnTab() { // (count, item){
        let $this = $(this);

        // console.log($this);
        $this.on('click', function tabClicked(event) {
            // event.preventDefault();
            $.fn.tabbify.fetchContent($this);
        });
    });
}
/*
    @function: restoreTab
    @param: null
    @returns: null
    @description: show the page based on the url.
*/
$.fn.tabbify.restoreTab = function(){
    let bookMark = window.location.hash || localStorage.getItem('hash');
    let activeTab = bookMark ? $(`a[href="${bookMark}"]`) : $($('.tab-nav').find('a').get(0));
    console.log (activeTab);
    $.fn.tabbify.fetchContent(activeTab);
}
/*
    @function: docReady
    @param: null
    @returns: null
    @description: Runs when DOM is ready in the browser.
*/
function docReady() {
    // let selectors = {
    //     tabNav: $('.tab-nav'),
    //     tabContent: $('.tab-content'),
    //     contentContainer: $('.tab-content > [id^="tab-content-"]')
    // };
    $('.tab-new').tabbify({
        
    });
}

$(docReady);

