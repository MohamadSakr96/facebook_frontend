let user_name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let password_check = document.getElementById("password_check");
let signup = document.getElementById('signup');


signup.addEventListener('click', signUp);


function signUp() {
    if(user_name.value == "" && email.value == "" && password.value == "" && password_check.value == "") {
        alert("Please fill all fields");
    }else {
        let image = document.getElementById("image")['files'][0];
        let image_path = document.getElementById("image").value;
        
        let extension = image_path.split(".")[1];

        let base64String = btoa(image);
        
        axios.post('../../facebook_backend/PHP/signup.php', 
            {
                user_name: `${user_name.value}`,
                email: `${email.value}`,
                password: `${password.value}`,
                password_check: `${password_check.value}`,
                file: `${base64String}`,
                extension: `${extension}`
            }
            ).then(function (response) {
                console.log(response, "this is the response");
            })
            .catch(function (error) {
                console.log(error, "didn't work");
            });
    }
}