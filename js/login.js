let login = document.getElementById("login");
let email=document.getElementById("email");
let password=document.getElementById("password");
let response=document.getElementById("response");


login.addEventListener("click", login);

function login(){

    if(email.value==="" || password.value===""){
        response.innerHTML="<p>Please fill all fields.</p>";
    }else{
        axios.post('../../facebook_backend/PHP/login.php', 
        {
            email: `${email.value}`,
            password: `${password.value}`,

        }
        ).then(function (response) {
            localStorage.setItem("id", response.data.user_id);
            window.location.replace("http://localhost/facebook_frontend/home.html");
        })
        .catch(function (error) {
            console.log(error, "didn't work");
        });

    }


}