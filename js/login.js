$(document).ready(function() {
   
    
    $("#loginform").on('submit', function(e) {
        e.preventDefault();
        var formdata = $(this).serialize();
        
        $.ajax({
            url: "php/login.php",
            method: "POST",
            data: formdata,
            success: function(response) {
                var data=JSON.parse(response);
                if (data.status === 'success') {
                    localStorage.setItem('sid', data.sid); 
                    window.location.href='profile.html';// Store SID in local storage
                   
                } else {
                    alert(data.message);
                   
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
            }
        });
    });
});
