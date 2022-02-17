let login_button = document.getElementById("login");
let email=document.getElementById("email");
let password=document.getElementById("password");
let message=document.getElementById("response");


login_button.addEventListener("click", logIn);

function logIn(){

    if(email.value==="" || password.value===""){
        message.innerHTML="<p>Please fill all fields.</p>";
    }else{
        axios.post('../../facebook_backend/PHP/login.php', 
        {
            email: `${email.value}`,
            password: `${password.value}`,

        }
        ).then(function (response) {

            if (response.data.status==="Logged In !"){
                localStorage.setItem("id", response.data.user_id);
                window.location.replace("http://localhost/facebook_frontend/home.html");
            }else{
                message.innerHTML="<p>User not found.</p>";
            }
        })
        .catch(function (error) {
            console.log(error, "didn't work");
        });
    }
}