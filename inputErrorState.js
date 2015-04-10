/*
Positioning Constraint: Since error state is absolutely positioned, to place in proper location, the parent of this element must be positioned relatively (or such that we can define the edges of the input correctly)
*/

define(['jquery', 'knockout'],
    function ($, ko) {

        function determineType(obj) {
            if (Object.prototype.toString.call(obj) == '[object Object]') {
                return 'object';
            } else if (Object.prototype.toString.call(obj) == '[object Array]') {
                return 'array';
            } else if (Object.prototype.toString.call(obj) == '[object Boolean]') {
                return 'boolean';
            } else { 
                return (typeof obj).toString().toLowerCase();
            }
        }

        ko.bindingHandlers.inputErrorState = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                // Initially create the error state element next to the input
                var valUnwrapped = ko.unwrap(valueAccessor()),
                    $focusElement = $(element),
                    childBindingContext = bindingContext.createChildContext(
                        {
                            messages: determineType(valUnwrapped) === 'array' ? valueAccessor() : [],
                        }
                    ),
                    $errorStateElem = $("<div class='inputErrorState-container' style='display: none; float: right; min-width: 15px; min-height: 15px; background-color: red; padding: 0 4px; border-radius: 0 0 3px 3px; overflow: visible; position: absolute; right:0; z-index: 10; '>\
                                            <div class='inputErrorState-icon-container' style='float: right; height:15px; width:15px; padding:2px;'>\
                                                <svg style='width: 100%; height: 100%; fill: white; vertical-align: top;' viewBox='0 0 500 500'>\
                                                    <path d='M249.5,1C112,1,1,112,1,249.5S112,498,249.5,498S498,387,498,249.5S386.4,1,249.5,1z M294,236.2l-8.6,13.3l34.6,51.8l0,0\
                                                        l22.6,33.9c4.7,6.6,4.7,14.6,0,17.3l-33.9,22.6c-4.7,2.7-11.3,0-15.9-6.6l-43.2-65.1l-45.2,68.4c-3.3,5.3-10,7.3-14,4l-34.6-21.9\
                                                        c-4.7-2.7-5.3-9.3-1.3-14.6l25.9-39.2l0,0l33.2-50.5L179.1,197l0,0l-22.6-33.9c-4.7-6.6-4.7-14.6,0-17.3l33.9-22.6\
                                                        c4.7-2.7,11.3,0,15.9,6.6l43.2,65.1l43.9-66.4c4.7-6.6,11.3-9.3,15.9-6.6l33.9,22.6c4.7,2.7,4.7,10.6,0,17.3L294,236.2L294,236.2z' />\
                                                </svg>\
                                            </div>\
                                            <div class='inputErrorState-message-container' style='display: none; clear: both; color: white; font-size: .8em; vertical-align: top;'>\
                                                <ul style='padding-left: 15px;' data-bind='foreach: messages'>\
                                                    <li data-bind='text: Message'></li>\
                                                </ul>\
                                            </div>\
                                       </div>");

                             
                $(element).after($errorStateElem);

                if (determineType(valUnwrapped) === 'object') { //If the options passed are an object, then look for optional params to hook up
                    if (ko.unwrap(valUnwrapped.messages)){
                        childBindingContext.$data.messages = valueAccessor().messages;
                    }
                    if ($(ko.unwrap(valUnwrapped.focusElement)).length > 0) {                        
                        $focusElement = $(ko.unwrap(valUnwrapped.focusElement));
                    }                   
                }
                if ($focusElement.length > 0) {//Element actually exists
                    $focusElement.on('focus', function triggerErrorExpansion() {
                        if ($errorStateElem.is(":visible")) {
                            $errorStateElem.find('.inputErrorState-message-container').show('fast');
                        }
                    });
                    $focusElement.on('blur', function triggerErrorCollapse() {
                        $errorStateElem.find('.inputErrorState-message-container').hide('fast');
                    });
                }

                ko.applyBindingsToDescendants(childBindingContext, $errorStateElem[0]);

                //return { controlsDescendantBindings: true };
            },
            update: function (element, valueAccessor) {
                // Whenever the value subsequently changes (including on first render/after init)
                var valUnwrapped = ko.unwrap(valueAccessor()),
                    valType = determineType(valUnwrapped),
                    $focusElement = $(element),
                    $errorStateElem = $(element).siblings('.inputErrorState-container');

                if (determineType(valUnwrapped) === 'object') { //If the options passed are an object, then look for optional params to hook up
                    if (ko.unwrap(valUnwrapped.focusElement)) {
                        $focusElement = $(ko.unwrap(valUnwrapped.focusElement));
                    }
                }

                if (valType === 'object') { //loop through options (minimal support)
                    /*
                    Possible options to pass in:
                        - Error state class (class to apply on error)
                    */

                    //ko.utils.objectForEach(filter, function (filterName, shouldHaveFilter) {});
                    if (ko.unwrap(valUnwrapped.messages).length > 0) { //Errors exist, add error state
                        $errorStateElem.show();
                        if ($focusElement.is(":focus")) {
                            $errorStateElem.find('.inputErrorState-message-container').show('fast');
                        }
                    } else { //Remove the error state
                        $errorStateElem.hide();
                    }
                } else if (valType === 'array') {
                    if (valUnwrapped.length > 0) { //Errors exist, add error state
                        $errorStateElem.show();
                        if ($focusElement.is(":focus")) {
                            $errorStateElem.find('.inputErrorState-message-container').show('fast');
                        }
                    } else { //Remove the error state
                        $errorStateElem.hide();
                    }
                } else if (valType === 'boolean') {
                    if (valUnwrapped === true) { //Errors exist, add error state
                        $errorStateElem.show();
                        if ($focusElement.is(":focus")) {
                            $errorStateElem.find('.inputErrorState-message-container').show('fast');
                        }
                    } else { //Remove the error state
                        $errorStateElem.hide();
                    }
                } else { //Else something is janky and we're not going to support it yet
                    $errorStateElem.hide();
                }
            }
        };
    });