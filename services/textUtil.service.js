(function() {
	'use strict';

	angular.module('gbrs.services').service('textUtil', textUtil);

	function textUtil() {
		// populate a text string containing placeholders with the supplied values, in a map.
		// placeholder keys are contained within curly braces, '{' and '}'.
		this.populate = function(string, values) {
			for (var key in values) {
				string = string.replace('{' + key + '}', values[key]);
			}
			
			return string;
		};
        
        this.isEmpty = function(str){
            if((typeof(str) == 'undefined') || ($.trim(str).length == 0))
                return true;
            return false;
        };
      
        this.random = function(){
            return moment().unix();
        };
        this.isNumberEmpty = function (num) {
          if (num == -1) return true;
          return s.isBlank(num);
        }
        this.removeCharsNonASCII = function (str){
          //remove non-ASCII characters and replace the ASCII diacritics to closest character like(from="àáäâãåæèéëêìíïîòóöôõðøùüñÿýç",to="aaaaaaaeeeeiiiiooooooouunyyc) using cleanDiacritics in underscore.string
          str = str.replace(/[^\x00-\xFF]/g, "");
          return s.cleanDiacritics(str);
        }
        this. preciseDecimals = function(num, decimals) {
          if (s.isBlank(num)) return;
          return Number(num).toFixed(decimals);
        }
	};
})();