$(document).ready(function() {
   
    
    $("#loginform").on('submit', function(e) {
        e.preventDefault();
        var formdata = $(this).serialize();
        
        $.ajax({
            url: "php/login.php",
            method: "POST",
            data: formdata,
            success: function(response) {
                if(response.trim() === "Login successful") {
                    window.location.href = "profile.html";
                } else {
                    alert(response);
                }
            },
            error: function() {
                alert("Error in processing data");
            }
        });
    });
});
