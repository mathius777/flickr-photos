 
var setupPhotos = (function ($) {
    function each (items, callback) {
        var i;
        for (i = 0; i < items.length; i += 1) {
            setTimeout(callback.bind(this, items[i]), 0);
        }
    }

    function flatten (items) {
        return items.reduce(function (a, b) {
            return a.concat(b);
        });
    }

    function loadPhotosByTag (tag, max, callback) {
        var photos = [];
        var callback_name = 'callback_' + Math.floor(Math.random() * 100000);

        window[callback_name] = function (data) {
            delete window[callback_name];
            var i;
            for (i = 0; i < max; i += 1) {
                photos.push(data.items[i].media.m);
            }
            callback(null, photos);
        };

        $.ajax({
            url: 'http://api.flickr.com/services/feeds/photos_public.gne',
            data: {
                tags: tag,
                lang: 'en-us',
                format: 'json',
                jsoncallback: callback_name
            },
            dataType: 'jsonp'
        });
    }

    function loadAllPhotos (tags, max, callback) {
        var results = [];
        function handleResult (err, photos) {
            if (err) { return callback(err); }

            results.push(photos);
            if (results.length === tags.length) {
                callback(null, flatten(results));
            }
        }

        each(tags, function (tag) {
            loadPhotosByTag(tag, max, handleResult);
        });
    }

    function renderPhoto (photo) {
        var img = new Image();
        img.src = photo;
        return img;
    }



    function imageAppender (id) {
        var holder = document.getElementById(id);
        return function (img) {
            var elm = document.createElement('div');
            elm.className = 'photo';         
            elm.id=img.src;
            elm.appendChild(img);
            
     		holder.appendChild(elm);
                				
        	
        };
    }

   
	function SaveImgCookie(name,value,daystokeepcookie) 
	{
		if (daystokeepcookie) 
		{
			var date = new Date();
			date.setTime(date.getTime()+(daystokeepcookie*24*60*60));
			var expires = "; expires="+date.toGMTString();
		}
		else 
		{
			var expires = "";
		}
		document.cookie = name+"="+value+expires+";";
	}

	function ReadImgCookie(name) 
	{
		var tmp = name + "=";
		var cookiesplit = document.cookie.split(';');
		for(var i=0;i < cookiesplit.length;i++) 
		{
			var c = cookiesplit[i];
			while (c.charAt(0)==' ')
			{ 
				c = c.substring(1,c.length);//skip blank
			}
		
			if (c.indexOf(tmp) == 0) 
			{				
				return c.substring(tmp.length,c.length);
			}
		}
	 	//didnt find cookie, so return null
		return null;
	}
    
    var max_per_tag = 5;
    return function setup (tags, callback) {
    	
     
        loadAllPhotos(tags, max_per_tag, function (err, items) {
            if (err) { return callback(err); }

            each(items.map(renderPhoto), imageAppender('photos'));             
            callback();
     
     
     	 // FAVORITE PHOTO BUTTONS MAIN FUNCTIONALITY
		$(function(){ setTimeout(function()
	    {
	   
	          	   //wait til the elements are loaded or the buttons won't get added properly.  
	                //loop through each child, where each child is a "photo" div 
				 	$('#photos').children().each(function() 
		        	{         	
		        		
		        		 var tmp="fav"+this.id;		        		  
		        		 //check to see if the image exists in the cookies. if it does, we load a solid heart, otherwise an empty heard
		        		if(ReadImgCookie(tmp) != null) 
		        		{
		        			//we generate a unique id for the icon so that we can change it later when someone clicks on it
		        			$(this).append('<div id="'+ tmp + '"  class="zoom" style="font-size:14px;">  <a id="btn" class="btn" href="#"> <i id="heart'+ tmp + '" class="icon-heart"></i> </a> </div>  '); 	        			 
						}
						else  //load empty heart :( 
						{				 		
							$(this).append('<div id="'+ tmp + '"  class="zoom" style="font-size:14px;">  <a id="btn" class="btn" href="#"> <i id="heart'+ tmp+ '"  class="icon-heart-empty"></i> </a> </div>  '); 	       			 
						}
												 
					//set each button element to have a click() which saves the full image name to a cookie.    		        
		        	var tmp2= document.getElementById(tmp);		      
		        	tmp2.onclick = function() 
		        	{				   		 
					    SaveImgCookie(this.id,this.id,1);
					    var iconname="heart"+tmp; 
					    document.getElementById(iconname).className="icon-heart";
					};
  
		      
		});}, 500);});

        	 
				
        });
    };
}(jQuery));
