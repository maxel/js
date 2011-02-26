// bcNav - to establish navigating context for category menu
// version: 1.5.2

( function($) {
	$.fn.bcNav = function(options) {

		if( this.length === 0 ) {
			return;
		}

		var settings = {
      		'followurl'				: true,
			'replaceheader'		: true,
			'headingtype'			: 'h2',
			'context'					: null,
			'parentclass'			: 'SideCategoryListClassic',
			'keepclass'				: false,
			'removeheading'			: false
    		};
		options = $.extend( settings, options );
		options.parentclass = '.' + options.parentclass;
		var level = 2;
		
		var menu_id = this.attr('id');
		
		return this.each(function(i, e) {        
			// init location
			if( checkLevel() ) return;
			
			var menu_element = findTarget(level);
			//menu_element instanceof $);
			var _menu = $(menu_element);
			if( _menu.children('ul').length == 0 ) {
				menu_element = menu_element.parentNode.parentNode;
				_menu = $(menu_element);
			}
			
			_menu = _menu.clone(true);
			var header_txt = _menu.find("a:first").html();
			_menu.children('ul:first').css({'display':'block','visibility':'visible'});
			_menu.find("a:first").remove();
		
			if( options.keepclass ) {
				$(this).find(options.parentclass + ' ul').attr('class');
				_menu.children("ul:first").addClass(
					$(this).find(options.parentclass + ' ul').attr('class')
				);
			}
		
			if( options.replaceheader ) {
				$(this).find(options.headingtype + ':first').empty();
				$(this).find(options.headingtype + ':first').html(header_txt);
			}
			if( options.removeheading ) {
				$(this).find(options.headingtype + ':first').remove();
			}
	
			// Insert new menu
			$(this).find(options.parentclass + ' ul').remove();
			$(this).find(options.parentclass).prepend(_menu.html());
	
			//_menu.css({'display':'block','visibility':'hidden'});
			//$(this).css({'display': 'block', 'visibility':'visible'});
			_menu = null;

    		});

		function checkLevel() {
			var _loc = getLocation();
			var tmp_location = _loc[_loc.length - level];
		
			// if we are on the root category page, not subcategory, exit
			if( tmp_location == _loc[1] ) return 1;
		}

		function format( format_str ) {
			return format_str.replace(/-/g," ");
		}
		
		function getLocation() {
		    if( options.context ) {
				var tmp_loc = options.context;
			} else {	
				var tmp_loc = location.pathname;
			}
			return tmp_loc.split("/");
		}
		// find <a> element who's innerHTML is equal to the location
		function findTarget( level ) {
		
			var loc_array = getLocation();
			var target_el = document.getElementById(menu_id);
			var supportsNodeIterator = typeof document.createNodeIterator == "function";
			if( supportsNodeIterator ) {
			
				var filter = function(node){
					return node.tagName.toLowerCase() == "a" ?
						NodeFilter.FILTER_ACCEPT :
						NodeFilter.FILTER_SKIP;
					};
				for( a=2; a <= loc_array.length - level; a++ ) {
				
					var re = new RegExp('^' + format( loc_array[a] ) + '$');
					var iterator = document.createNodeIterator(target_el, NodeFilter.SHOW_ELEMENT,filter, false);
					var node = iterator.nextNode();
					while (node !== null) {
						var txt = ( typeof node.innerText == "undefined" ) ? node.textContent : node.innerText;node.innerHTML;
						if( txt.match(re) ) {
								target_el = node.parentNode;
								break;
						} else {
							node = iterator.nextNode();
						}
					}
				}
			} else { // NodeFilter and NodeIterator not supported by IE. support IE here by using jquery
			
				var $_target_el = $(target_el);
				for( a=2; a <= loc_array.length - level; a++ ) {
					var re = new RegExp('^' + format( loc_array[a] ) + '$');
					$_target_el.find('a').each( function() {
						var txt = $(this).html();
						if( txt.match(re) ) {
							$_target_el = $(this).parent();
							target_el = this.parentNode;
						}
					});
				}
			}
			return target_el;
		};
	};
})(jQuery);


