(function($){
    $.deparam = $.deparam || function(uri){
        if(uri === undefined){
            uri = window.location.pathname;
        }
        
        var path = window.location.pathname;
        var pathDiversion = path.split('/');
        var param = pathDiversion.pop();
        return param;
    }
        
})(jQuery);
