var data;
var numProjects;

function handleKeyPress(event, fieldName) {
    if (event.key === 'Enter') {
        saveText(fieldName);
    }
}

function makeEditable(field) {
    var textElement = document.getElementById(field + 'Text');
    var inputElement = document.getElementById(field + 'Input');
    var pencilElement = document.getElementById('pencil' + field);

    inputElement.value = textElement.innerText.trim();
    pencilElement.style.display = "none";
    textElement.style.display = "none";
    inputElement.style.display = "inline-block";
    inputElement.focus();
}

function saveText(field) {
    var textElement = document.getElementById(field + 'Text');
    var inputElement = document.getElementById(field + 'Input');
    var pencilElement = document.getElementById('pencil' + field);
    var updatedValue = inputElement.value;

    if (updatedValue === textElement.innerText.trim()) {
        // No change, do not proceed
        textElement.style.display = "inline";
        inputElement.style.display = "none";
        pencilElement.style.display = "inline-block";
        return; // Exit the function early
    }


    $.ajax({
        url: 'php/profile.php',
        method: 'POST',
        data: {
            formaction: 'Update' + field,
            value: updatedValue,
            sid:localStorage.getItem('sid'),
        },
        success: function(response) {
            const data = JSON.parse(response);
            if (data.status === 'success') {
                textElement.innerText = updatedValue;
                textElement.style.color = "white";
                textElement.style.display = "inline";
                inputElement.style.display = "none";
                pencilElement.style.display = "inline-block";
                console.log(field + ' updated successfully');
            } else {
                console.error('Update failed');
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

function showinput(field) {
    document.getElementById('add' + field).classList.add('d-none');
    document.getElementById(field + 'input').classList.remove('d-none');
    document.getElementById('save' + field).classList.remove('d-none');
    document.getElementById(field + 'url').classList.add('d-none');
}



function savelink(field) {
    var updatedValue = document.getElementById(field + 'input').value.trim();

    $.ajax({
        url: 'php/profile.php',
        method: 'POST',
        data: {
            formaction: 'Update' + field,
            value: updatedValue,
            sid:localStorage.getItem('sid')
        },
        success: function(response) {
            const data = JSON.parse(response);
            if (data.status === 'success') {
                
                $('#' + field + 'url').html('<a class="text-white" href="' + updatedValue + '" target="_blank">' + updatedValue + '</a>').removeClass('d-none');
                $('#' + field + 'input').addClass('d-none').val(''); // Hide input field and clear its value
                $('#save' + field).addClass('d-none');
                $('#add' + field).removeClass('d-none fa-plus').addClass('fa-pencil d-inline'); // Show pencil icon

                // Re-attach click event handler for pencil icon
                $('#add' + field).off('click').on('click', function() {
                    showinput(field);
                });

                console.log(field + ' updated successfully');
            } else {
                console.error('Update failed');
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}


function calculateAge(dob) {
    const [year, month, day] = dob.split('-');
    const dobDate = new Date(year, month - 1, day);
    const diffMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(diffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
}

function getformdata() {
    var update_form = document.getElementById('editForm');
    if (data.status === 'success') {
        const user = data.data;
        update_form.querySelector('#editfirstname').value = user.firstname;
        update_form.querySelector('#editlastname').value = user.lastname;
        update_form.querySelector('#editdob').value = user.dob;
        update_form.querySelector('#editphone').value = user.phone;
        update_form.querySelector('#editaddress').value = user.address;
    }
}
$(document).ready(function() {
    $('#editForm').on('submit', function(event) {
        event.preventDefault();
        
        // Serialize form data
        var formData = $(this).serialize();
        
        // Add additional parameters to data object
        var sid = localStorage.getItem('sid');
        formData += '&formaction=update_details&sid=' + sid;
        
        $.ajax({
            url: 'php/profile.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    const user = response.data;
                    $('#fullname').text(user.firstname + ' ' + user.lastname);
                    $('#fullnamebox').text(user.firstname + ' ' + user.lastname);
                    $('#dob').text(user.dob);
                    $('#age').text(calculateAge(user.dob));
                    $('#email').text(user.email);
                    $('#phone').text(user.phone);
                    $('#address').text(user.address);
                    $('#roleText').text(user.role);
                    $('#instituteText').text(user.institute);
                    $('#editModal').modal('hide');
                    alert('Profile updated successfully!');
                } else {
                    alert('Profile update failed: ' + response.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('AJAX error: ' + textStatus + ': ' + errorThrown);
            }
        });
    });
});


function saveProject(id) {
    var projectId = id;
    var projectTitle = $(`#projectTitle-${id}`).val();
    var projectGithub = $(`#projectGithub-${id}`).val();
    var projectDescription = $(`#projectDescription-${id}`).val();

    if (projectTitle == '') {
        alert('Project Title is Mandatory !');
        return;
    }
    if (projectDescription == '') {
        alert('Project Description can\'t be Empty !');
        return;
    }
    if (projectGithub == '') {
        alert('Enter Project Github link or document !');
        return;
    }

    $.ajax({
        url: 'php/profile.php',
        method: 'POST',
        data: {
            formaction: 'add_project',
            projectId: projectId,
            projectTitle: projectTitle,
            projectGithub: projectGithub,
            projectDescription: projectDescription,
            sid: localStorage.getItem('sid')
        },
        success: function(response) {
            const data = JSON.parse(response);
            if (data.status === 'success') {
                showprojects();
                $(`#project-${id} .save-btn`).addClass('d-none');
            } else {
                console.error('Project update failed');
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

function shareProject(id) {
    var projectUrl = $(`#projecturl-${id} a`).attr('href');

    navigator.clipboard.writeText(projectUrl).then(function() {
        var tooltip = document.createElement('div');
        tooltip.textContent = 'Copied!';
        tooltip.className = 'copy-tooltip';
        document.body.appendChild(tooltip);

        document.addEventListener('mousemove', function(e) {
            tooltip.style.top = (e.pageY - 30) + 'px';
            tooltip.style.left = (e.pageX + 20) + 'px';
        });

        setTimeout(function() {
            tooltip.parentNode.removeChild(tooltip);
        }, 1000);
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
    });
}
function deleteProject(project_name, id) {
    var projectId = id;
     
    $.ajax({
        url: 'php/profile.php',
        method: 'POST',
        data: {
            formaction: 'delete_project',
            projectId: projectId,
            projectTitle: project_name,
            sid: localStorage.getItem('sid')
        },
        success: function(response) {
            const data = JSON.parse(response);
            if (data.status === 'success') {
                showprojects(); // Assuming this function exists to refresh the project list
            } else {
                console.error('Project deletion failed');
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}


function showprojects() {
    $.ajax({
        url: "php/profile.php",
        method: "POST",
        data:{sid: localStorage.getItem('sid')},
        success: function(response) {
            var data = JSON.parse(response);
            if (data.status === 'success') {
                const user = data.data;
                const projects = user.projects || [];
                const numProjects = Object.keys(projects).length;
                $('#projectFields').empty();

                for (let index = 0; index < numProjects; index++) {
                    let project = projects[index];
                    let projectHtml = `
                    <div class="row gutters-sm mt-3">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="card-title mb-3">
                                        <div class="new"><h4 class="project-title" id="projectname-${project.id}">${project.title}</h4>
                                            <span class="icons">
                                                <i class="fa-solid fa-share mr-3" onclick="shareProject(${project.id})"></i>
                                                <i class="fa-regular fa-trash-can" id="del_icon" value=${project.id} onclick="deleteProject('${project.title}', '${project.id}')"></i>        </span>
                                        </div>
                                        <p class="project-url" id="projecturl-${project.id}">
                                            <a href="${project.github}" target="_blank">${project.github}</a>
                                        </p>
                                    </div>
                                    <span class="project-description">
                                        <p class='custom-text'>${project.description}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    $('#projectFields').append(projectHtml);
                }
            } else {
                console.log("Error: Status is not 'success'.");
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}



// Function to handle adding new project fields
$(document).ready(function() {
  

    $('#addProjectBtn').click(function() {
        $.ajax({
            url: "php/profile.php",
            method: "POST",
            data: {sid:localStorage.getItem('sid')},
            success: function(response) {
                console.log(response); 
                var data = JSON.parse(response);
                if(data.status =='success'){

           const user = data.data; 
           const projects = user.projects || [];
        const numProjects = Object.keys(projects).length;
        console.log('Number of projects: add', numProjects);
   
        let projectCount = numProjects;
        console.log(projectCount);
        let projectHtml = `
               <div class="row mt-3">
           
                <div class="col-md-6">
                    <input type="hidden" class="form-control" id="projectId-${projectCount}" name="projectId-${projectCount}" value="${projectCount}">
                    <input type="text" class="form-control" placeholder="Project Title" id="projectTitle-${projectCount}" name="projectTitle-${projectCount}" required>
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="GitHub URL" id="projectGithub-${projectCount}" name="projectGithub-${projectCount}">
                </div>
                <div class="col-md-12 mt-3">
                    <textarea class="form-control project-descriptionform" placeholder="Describe Your Project" id="projectDescription-${projectCount}" name="projectDescription-${projectCount}" required></textarea>
                </div>
                <div class="col-md-1 mt-3">
                    <button class="btn btn-success savebtn" style="width=200px" onclick="saveProject(${projectCount})">Save</button>
                  
                </div>
               
            </div>
            
        `;

        
        $('#projectFields').append(projectHtml);
    }}});
    });
});


// Function to initialize page content on window load
window.onload = function() {

    // Check if localStorage contains 'sid'
    var sid = localStorage.getItem('sid');
    
    if (!sid) {
        // If 'sid' is not present, redirect to login page
        alert('Please login to access the Profile page !');
        window.location.href = 'login.html';
        return; // Stop further execution
    }
    $.ajax({
        url: "php/profile.php",
        method: "POST",
        data:{sid:localStorage.getItem('sid')},
        success: function(response) {
            data = JSON.parse(response); // Parse the JSON response
              console.log(localStorage.getItem('sid'));
            if (data.status === 'success') {
                const user = data.data; // Extract the user object from data
                const projects = user.projects || []; // Extract the projects object from user object

                showprojects(); // Display user projects
               
                const numProjects = Object.keys(projects).length;
                
                
                // Update user profile details
                $('#fullname').text(user.firstname + ' ' + user.lastname);
                $('#fullnamebox').text(user.firstname + ' ' + user.lastname);
                $('#dob').text(user.dob);
                $('#age').text(calculateAge(user.dob));
                $('#email').text(user.email);
                $('#phone').text(user.phone);
                if(user.address == null)
                {
                    $('#address').text('Address');
                }  
                else{
                    $('#address').text(user.address);
                }

              
                $('#roleText').text(user.role);
                $('#instituteText').text(user.institute);
                if (user.website == null) {
                    $('#addwebsite').removeClass('d-none').removeClass('fa-pencil d-inline').addClass('fa-plus');
                } else {
                    $('#addwebsite').removeClass('d-none').removeClass('fa-plus d-inline').addClass('fa-pencil d-inline');
                    $('#websiteurl').html('<a class="text-white" href="' + user.website + '" target="_blank">' + user.website + '</a>').removeClass('d-none');
                }
                if (user.github == null) {
                    $('#addgithub').removeClass('d-none').removeClass('fa-pencil d-inline').addClass('fa-plus');
                } else {
                    $('#addgithub').removeClass('d-none').removeClass('fa-plus d-inline').addClass('fa-pencil d-inline');
                    $('#githuburl').html('<a class="text-white" href="' + user.github + '" target="_blank">' + user.github + '</a>').removeClass('d-none');
                }
                if (user.instagram == null) {
                    $('#addwebsite').removeClass('d-none').removeClass('fa-pencil d-inline').addClass('fa-plus');
                } else {
                    $('#addinstagram').removeClass('d-none').removeClass('fa-plus d-inline').addClass('fa-pencil d-inline');
                    $('#instagramurl').html('<a class="text-white" href="' + user.instagram + '" target="_blank">' + user.instagram + '</a>').removeClass('d-none');
                }
            } else {
                console.error('User not found');
            }

        },
        error: function(error) {
            console.error('Error:', error);
        }
    });

};



$(document).ready(function() {
    $('.logout').on('click', function() {
        var sid = localStorage.getItem('sid');

        if (sid) {
            $.ajax({
                url: "php/logout.php",
                method: "POST",
                data: { sid: sid },
                dataType: "json", // Ensure JSON dataType for proper parsing
                success: function(response) {
                    if (response.status === 'success') {
                        alert(response.message); // Optionally display a success message
                        localStorage.removeItem('sid'); // Clear sid from localStorage
                        window.location.href = 'index.html'; // Redirect to login page or another appropriate page
                    } else {
                        alert(response.message); // Display an error message if logout fails
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    alert('Failed to logout. Please try again.'); // Display an error message
                }
            });
        } else {
            alert('Session ID not found in localStorage. Please login again.'); // Display a message if sid is not found
        }
    });
});

$(document).ready(function() {
    var cursor = $(".cursor");
    var cursor2 = $(".cursor2");
    var container = $(".main-body");

    $(document).on("mousemove", function(e) {
        cursor.css({
            left: e.clientX + "px",
            top: e.clientY + "px"
        });
        cursor2.css({
            left: e.clientX + "px",
            top: e.clientY + "px"
        });
    });

    if (container.length) {
        container.on("mouseover", function() {
            cursor.addClass("active");
        });

        container.on("mouseout", function() {
            cursor.removeClass("active");
        });
    } else {
        console.error("Container element not found.");
    }
});
