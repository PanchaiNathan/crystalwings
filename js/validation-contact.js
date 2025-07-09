$(document).ready(function(){
        $('#send_message').click(function(e){
            
            //Stop form submission & check the validation
            e.preventDefault();
            
            // Variable declaration
            var error = false;
            var name = $('#name').val();
            var email = $('#email').val();
            var phone = $('#phone').val();
            var message = $('#message').val();
            
            $('#name,#email,#phone,#message').click(function(){
                $(this).removeClass("error_input");
            });
            
            // Form field validation
            if(name.length == 0){
                var error = true;
                $('#name').addClass("error_input");
            }else{
                $('#name').removeClass("error_input");
            }
            if(email.length == 0 || email.indexOf('@') == '-1'){
                var error = true;
                $('#email').addClass("error_input");
            }else{
                $('#email').removeClass("error_input");
            }
            if(phone.length == 0){
                var error = true;
                $('#phone').addClass("error_input");
            }else{
                $('#phone').removeClass("error_input");
            }
            if(message.length == 0){
                var error = true;
                $('#message').addClass("error_input");
            }else{
                $('#message').removeClass("error_input");
            }
            
            // If there is no validation error, next to process the mail function
            if(error == false){
               // Disable submit button just after the form processed 1st time successfully.
                $('#send_message').attr({'disabled' : 'true', 'value' : 'Sending...' });
                
                // Add ajax flag to the data
                var formData = $("#contact_form").serialize() + "&ajax=true";
                
                /* Post Ajax function of jQuery to get all the data from the submission of the form */
                $.post("send-email.php", formData, function(result){
                    console.log("Response from server:", result);
                    
                    // Check the result
                    if(result.status === 'success'){
                        // If the email is sent successfully, remove the submit button
                        $('#contact_form').hide();
                        // Display the success message
                        $('#success_message').fadeIn(500);
                    } else {
                        // Display the error message
                        var errorMsg = result.message || "Sorry, error occurred while sending your message.";
                        $('#mail_fail').text(errorMsg).fadeIn(500);
                        // Enable the submit button again
                        $('#send_message').removeAttr('disabled').attr('value', 'Send Message');
                    }
                }, 'json')
                .fail(function(xhr, status, error) {
                    console.error("AJAX Error:", status, error);
                    $('#mail_fail').text("Error: " + status + " - " + error).fadeIn(500);
                    $('#send_message').removeAttr('disabled').attr('value', 'Send Message');
                });
            }
        });    
    });