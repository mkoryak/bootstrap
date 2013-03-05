(function($){

    var $window = $(window);

    // side bar
    setTimeout(function () {
        $('.bs-docs-sidenav').affix({
            offset: {
                top: function () { return 0; }
            }
        })
    }, 100);

    var highlightBlock = function(html){
        var text = dedent(html.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        return $("<pre class='prettyprint'>"+text+"</pre>");
    };

    //syntax highlighting:
    $('script.code').each(function(){
        var $this = $(this);
        var text = $this.text();
        $this.replaceWith(highlightBlock(text));
    });
    window.prettyPrint && prettyPrint();



})(jQuery);

/**
 * Remove any common leading whitespace from every line in `text`
 * Ported from http://hg.python.org/cpython/file/2.7/Lib/textwrap.py
 * @param text
 * @return {*}
 */
function dedent(text){
    var leadingWhitespaceRE = /(^[ \t]*)(?:[^ \t\n])/;
    var margin = null;
    var i;
    text = text.replace(/^[ \t]+$/m, ''); //whitespace only

    var lines = text.split('\n');
    for(i = 0; i < lines.length; i++){
        var line = lines[i];
        if(leadingWhitespaceRE.exec(line)){
            var indent = RegExp.$1;
            if(margin == null){
                margin = indent;
            } else if(indent.match(new RegExp("^"+margin))){
                // Current line more deeply indented than previous winner:
                // no change (previous winner is still on top).

            } else if(margin.match(new RegExp("^"+indent))){
                // Current line consistent with and no deeper than previous winner:
                // it's the new winner.
                margin = indent;
            } else {
                // Current line and previous winner have no common whitespace:
                // there is no margin
                margin = "";
                break;
            }
        }
    }
    if(margin) {
        for(i = 0; i < lines.length; i++){
            lines[i] = lines[i].replace(new RegExp('^' + margin), '');
        }
        text = lines.join('\n');
    }
    return text;
}