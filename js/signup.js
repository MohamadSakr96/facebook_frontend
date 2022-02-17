let user_name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let password_check = document.getElementById("password_check");
let signup = document.getElementById('signup');
let message = document.getElementById('message');

signup.addEventListener('click', signUp);

function signUp() {
    if(user_name.value == "" || email.value == "" || password.value == "" || password_check.value == "") {
        message.innerHTML="<p>Please fill all fields.</p>";
    }else {
        let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!reg.test(email.value)){
            message.innerHTML = "<p>Please enter a valid Email</p>";
            email.classList.add("border-red");
        }else{
            if (password.value != password_check.value) {
                message.innerHTML = "<p>Wrong Password</p>"
                password.classList.add("border-red");
                password_check.classList.add("border-red");
            }else {
                if(password.value.length < 8) {
                    message.innerHTML = "<p>Please pick a password with at least 8 letters and numbers</p>";
                    password.classList.add("border-red");
                    password_check.classList.add("border-red");
                }else {
                    if(!(/[A-Za-z]/.test(password.value) && /[0-9]/.test(password.value))) {
                        message.innerHTML = "<p>Your Password is Weak!</p>"
                        password.classList.add("border-red");
                        password_check.classList.add("border-red");
                    }else {
                        password.classList.remove("border-red");
                        password_check.classList.remove("border-red");
                        email.classList.remove("border-red");
                        
                        
                        axios.post('../../facebook_backend/PHP/signup.php',{
        
                            user_name: `${user_name.value}`,
                            email: `${email.value}`,
                            password: `${password.value}`,
                            password_check: `${password_check.value}`
        
                        }).then(function (response) {
                            if (response.data.message==="User created"){
                                message.innerHTML = "<p style='color: green'>Acount Created!</p>";
                            }else {
                                message.innerHTML = "<p>Email already exists!</p>";
                            }
                        }).catch(function (error) {
                            console.log(error, "didn't work");
                        });
                    }
                }
            }
        }
    }
}