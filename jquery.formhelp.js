/*!
 * jQuery FormHelp Plugin v0.1.0
 * https://github.com/invetek/jquery-formhelp
 *
 * Copyright 2013 Loran Kloeze - Invetek
 * Released under the MIT license
 */

(function($) {
    $.formHelp = function(){        

        $('span.helptext').each(function(){
            
            // Grab the inputelement(s) for this helpbox
            var inputelements = $(this).attr('data-for');
            var $inputelements = $(inputelements);
            
            var $helpbox = $('<div/>')
                    .addClass('form-helpbox')
                    .attr('data-for', inputelements)
                    .append($('<div/>')
                    .addClass('content')
                    .html($(this).html()));

            $inputelements.last().after($helpbox);       
            
            // Collect elements for calculating position of $helpbox
            var $boundaryElements = $inputelements;
            $inputelements.each(function(){
                $boundaryElements = $boundaryElements.add('label[for="'+$(this).attr('id')+'"]');
            });

            // Calculate top right corner of $boundaryElements and use
            // that value for the position of $helpbox
            var helpboxLeft = 0;
            var helpboxTop = $(document).height();
            $boundaryElements.each(function(){
                var thisLeft = $(this).offset().left + $(this).width();
                var thisTop = $(this).offset().top;
                helpboxLeft =  thisLeft > helpboxLeft ? thisLeft : helpboxLeft;
                helpboxTop = thisTop < helpboxTop ? thisTop : helpboxTop;
            });

            $inputelements.on('focus focusin', function(){
                $helpbox.css({
                    'left': helpboxLeft,
                    'top': helpboxTop
                }).fadeIn('fast');
            });

            $inputelements.on('blur focusout', function(){  
              $helpbox.fadeOut('fast');
            });

            // There is no textarea resize event so we have to use mousemove            
            $inputelements.filter('textarea').on('mousemove', function(){
                $helpbox.css({
                    'left': $(this).offset().left + $(this).width(),
                    'top': $(this).offset().top
                });
            });
            
            // The elements that can't be clicked without changing their value or causing 
            // some kind of action. We use the mouseover/mouseout events instead of focus/blur.
            // The focus/blur events are still handled on these element because of the tab key.
            $inputelements.filter('[type="reset"],[type="submit"],[type="checkbox"],[type="radio"],[type="button"],\n\
                    [type="file"],[type="color"],[type="image"],[type="range"]').on('mouseover', function(){
                $(':input').blur();
                $('div[data-for]').fadeOut('fast');
                $helpbox.css({
                    'left': helpboxLeft,
                    'top': helpboxTop
                }).fadeIn('fast');             
            }).on('mouseout', function(){
               $helpbox.fadeOut('fast');
            });
            
            $(this).remove();
        });

    };

}(jQuery));