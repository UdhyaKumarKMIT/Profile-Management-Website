$(document).ready(function() {
    $('#registerForm').submit(function(e) {
        e.preventDefault(); 

        var dob = new Date($('input[name="DOB"]').val()); 
        var phone = $('input[name="phone"]').val();
        var email = $('input[name="email"]').val();
        var password = $('input[name="password"]').val();
        var re_password = $('input[name="re_password"]').val();

     
      var today = new Date();
      if (dob > today) {
          alert('Please check your Date of Birth.');
          return;
      }

        if (!email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

       
        if (password !== re_password) {
            alert('Passwords do not match.');
            return;
        }
        
        var formData = $(this).serialize(); 
        $.ajax({
            method: "POST",
            url: "php/register.php",
            data: formData,
            success: function(response) {
                console.log(response); 
                alert(response);
                if (response.trim() === 'Registration successful') {
                    window.location.href = 'login.html';
                } else {
                    alert(response); // Display the response in an alert
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert('Error occurred: ' + error); // Handle error response
            }
        });
    });
});
