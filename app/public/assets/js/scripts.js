
jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */
    $.backstretch("/assets/img/backgrounds/1.jpg");
    
    /*
        Form validation
    */
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
        $(".login-form").find("#divError").remove();
    });
    
    $('.login-form').on('submit', function(e) {
    	
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
                return;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});


        $(this).find('input[type="text"]').each(function(){
            
            if(validateEmail($(this).val())){
                $(this).removeClass('input-error');

            }
            else {
                $(this).addClass('input-error');
                var divError ="<div class='alert alert-danger' id='divError'>Addresse Email invalide</div>"
                $(".login-form").prepend(divError);
                e.preventDefault();
            }
        });


    	
    });
    
    
});


function validateEmail(email) { 
  // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
