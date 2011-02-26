// bcNav - to establish navigating context for category menu
// TODO: 
// 	1. sometimes urls have dashes in the names, when this happens _location won't translate correctly to the menu item. replace "-" with " ".
// 	2. When category has no children, traverse backwards up the context and display first parent with children.
// Version: 1.3.0	

( function($) {
	$.fn.bcNav = function(options) {

		if( this.length === 0 ) {
			return;
		}

		var settings = {
      			'followurl'		: true,
			'replaceheader'		: true,
			'headingtype'		: 'h2',
			'context'		: null,
			'parentclass'		: 'SideCategoryListClassic',
			'keepclass'		: false,
			'addclass'		: true
    		};
		options = $.extend( settings, options );
		options.parentclass = '.' + options.parentclass;

    		return this.each(function(i, e) {        
			
			// Get location
			if( options.followurl ) {
				var _loc = location.pathname;
				_loc = _loc.split("/");
				var _location = _loc[_loc.length - 2];
		
				// if we are on the root category page, not subcategory, exit
				if( _location == _loc[1] ) return;
			} else {
				// using options.context
				var _location = options.context;
			}

			// Lets do this
			var _menu = $(this).find("a:contains('" + _location + "')").parent().clone(true);
			if ( _menu.children('ul').length == 0 ) { return; }

			_menu.children('ul:first').css({'display':'block','visibility':'visible'});
			_menu.find("a:first").remove();
			//_menu.addClass('bcnavcontext');

			if( options.keepclass ) {
				$(this).find(options.parentclass + ' ul').attr('class');
				_menu.children("ul:first").addClass(
					$(this).find(options.parentclass + ' ul').attr('class')
				);
			}

			if( options.replaceheader ) {
				$(this).find(options.headingtype + ':first').empty();
				$(this).find(options.headingtype + ':first').html(_location);
			}

			if( options.addclass ) {
				var class_prefix = options.parentclass;
				class_prefix = class_prefix.replace('.','');
				class_prefix += "Sibling";
				_menu.find('ul:first').children('li').each( function(i) {
					$(this).addClass(class_prefix + i);
				});
			}
			
			// Insert new menu
			//$(this).find(options.parentclass + ' ul:first-child').remove();
			$(this).find(options.parentclass + ' ul').remove();
			$(this).find(options.parentclass).prepend(_menu.html());

			//_menu.css({'display':'block','visibility':'hidden'});
			//$(this).css({'display': 'block', 'visibility':'visible'});
			//console.log(_menu.html());
			//console.log("bcmod: finished");
			_menu = null;

    		});
	};
})(jQuery);

