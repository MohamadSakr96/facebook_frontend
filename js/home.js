let id=localStorage.getItem("id");
let my_posts=document.getElementById("my_posts");
let profile_info=document.getElementById("profile_info");
let notifications=document.getElementById("notification");
let content=document.getElementById("content");
let create_post=document.getElementById("add_post");
let create_post_div=document.getElementById("add_post_div");
let my_posts_btn=document.getElementById("my_posts");
let logout_btn=document.getElementById("logout");
let find_friend_btn=document.getElementById("find_friends");


my_posts.addEventListener("click",getUserPosts);
create_post.addEventListener("click",createPost);
my_posts_btn.addEventListener("click",myPosts);
find_friend_btn.addEventListener("click",()=>{
    findFriends(sendEvent);
});

console.log(id);

const user_info_request = axios.post('../../facebook_backend/PHP/user_info.php', {user_id:`${id}`});
const notifications_request =  axios.post('../../facebook_backend/PHP/friend_requests.php', {user_id:`${id}`});
const posts_request = axios.post('../../facebook_backend/PHP/get_posts.php', {user_id:`${id}`});


async function getFeed(){
await axios.all([user_info_request, notifications_request, posts_request]).then(axios.spread(function(res1, res2, res3) {
  renderUserInfo(res1);
  renderFriendRequests(res2);
  renderPosts(res3);
}));
}


getFeed().then(addEvents).then(addLikes);

let action_array=document.getElementsByClassName("action-button");
let likes_array=document.getElementsByClassName("like");

async function addEvents(){
    
    for (var i=0;i<action_array.length;i++){
        action_array[i].addEventListener("click",(e)=>{
    
        let splitted_id=e.target.id.split("_");
        handleRequest(splitted_id[0],splitted_id[1]);
        // document.getElementById(`notification_${user.user_id}`).innerHTML="";
    
    });
    
    }

}

async function addLikes(){
    
    for (var i=0;i<action_array.length;i++){
        likes_array[i].addEventListener("click",(e)=>{
    
        addLike(e.target.id);
        document.getElementById(e.target.id).style.color="red";
    
    });
    
    }

}


function addLike(e){
    axios.post('../../facebook_backend/PHP/like_dislike.php', 
    {
        user_id:`${id}`,
        post_id:`${e}`,
        action:`like`

    }
    ).then(function (response) {
       console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}




function handleRequest(action,friend_id){
    axios.post('../../facebook_backend/PHP/handle_request.php', 
    {
        user_id:`${id}`,
        to_user_id:`${friend_id}`,
        action:`${action}`

    }
    ).then(function (response) {
       console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}




function getUserPosts(){

    if(id===""){
        console.log("Id not defined");
    }else{
        axios.post('../../facebook_backend/PHP/get_own_posts.php', 
        {
            user_id:`${id}`
        }
        ).then(function (response) {
           console.log(response);
            
        })
        .catch(function (error) {
            console.log(error);
        });

    }

}

function renderUserInfo(user_data_response){

    profile_info.innerHTML=`
    <div class="profile-picture">
        <img src="assets/ProfilePicture.png" alt="profile pic" width="100px">
    </div>
    <div class="profile-name">
        <h2>${user_data_response.data[0].user_name}</h2>
    </div>`;


}

function renderFriendRequests(friend_requests_response){

    console.log(friend_requests_response);
    friend_requests_response.data.forEach(user => {
        notifications.innerHTML+=` 
        <div class="notification-item" id="notification_${user.user_id}">
            <div class="action-left">
                <div class="not-profile-picture">
                    <img src="assets/ProfilePicture.png" alt="profile pic">
                </div>
                <div class="not-profile-name">
                    <p>${user.user_name}</p>
                </div>
            </div>
            <div class="action-right">
                <div class="action">
                    <i class="fa-solid fa-check action-button"  id="accept_${user.user_id}" style="color:#25e55f;font-size:1.5rem"></i>
                    <i class="action-button fa-solid fa-xmark" id="delete_${user.user_id}" style="color:#ea4337;font-size:1.5rem"></i>
                </div>
            </div>
        </div>
        `;    

    });

}


function renderPosts(posts_response){


    posts_response.data.forEach(post => {

        var post_date = `${post.post_date}`;
        var splittedString=post_date.split(":");
        post_date=splittedString.slice(0,-1).join(':');

        content.innerHTML+=`
        <div class="post" >
        <div class="post-header">
            <div class="post-profile-picture">
                <img src="assets/ProfilePicture.png" alt="profile pic">
            </div>
            <div class="post-profile-name">
                <h4>${post.user_name}</h4>
            </div>
        </div>
        <div class="post-content">
            <textarea id="1" class="textarea" readonly>${post.post_content}</textarea>
        </div>
        <div class="post-footer">
            <div class="likes">${post.nb_likes} <i class="fa-solid fa-heart like" id="${post.post_id}"></i></div>
            <div class="date">${post_date}</div>
        </div>
    </div>`
    });

}

function createPost(){

    create_post_div.innerHTML=`<div id="create_post" class="filter">
    <div class="filter-post">
        <div class="filter-post-title ff-header">
            <h3>Create post</h3>
            <i class="action-button fa-solid fa-xmark" id="delete" style="color:#ea4337;font-size:1.5rem"></i>
        </div>
        <div class="post-content">
            <textarea id="post_text" class="textarea" placeholder="Write your status here..."></textarea>
        </div>
        <div class="filter-post-footer">
            <button id="post_submit" class="btn create-post" type="button">Submit</button>
        </div>
    </div>
</div>`;
document.getElementById("delete").addEventListener("click",()=>{
    create_post_div.innerHTML="";
});
document.getElementById("post_submit").addEventListener("click",()=>{
    
    axios.post('../../facebook_backend/PHP/create_post.php', 
    {
        user_id:`${id}`,
        post_content:document.getElementById("post_text").value

    }
    ).then(function (response) {
       console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    document.getElementById("add_post_div").innerHTML = "";
})
}

function myPosts(){

    axios.post('../../facebook_backend/PHP/get_own_posts.php', 
    {
        user_id:`${id}`

    }
    ).then(function (response) {
        
        add_post_div.innerHTML=` 
            <div id="create_post" class="filter">
                <div class="filter-MY-posts">
                    <div class="ff-header">
                        <h2 class="filter-MY-post-title">My Posts</h2>
                        <i class="action-button fa-solid fa-xmark" id="delete" style="color:#ea4337;font-size:1.5rem"></i>
                    </div>
                    <div id="my_posts_div"></div>
                </div>
            </div>
        `;
            document.getElementById("delete").addEventListener("click",()=>{
                add_post_div.innerHTML="";
            });
        let my_posts_div=document.getElementById("my_posts_div");
        response.data.forEach(post => {
            var post_date = `${post.post_date}`;
            var splittedString=post_date.split(":");
            post_date=splittedString.slice(0,-1).join(':');

            my_posts_div.innerHTML+=`
                <div class="post">
                    <div class="MY-posts-header">
                        <div class="left">
                            <div class="post-profile-name">
                                <h4>Hello!</h4>
                            </div>
                        </div>
                        <div class="right">
                            <i class="fa-solid fa-pen-to-square" style="color:#3c5b9a"></i>&nbsp&nbsp&nbsp
                            <i class="fa-solid fa-trash-can" style="color:#ea4337"></i>
                        </div>
                    </div>
                    <div class="post-content">
                        <textarea id="1" class="textarea" readonly>${post.post_content}</textarea>
                    </div>
                    <div class="post-footer">
                        <div class="likes">${post.nb_likes} likes</div>
                        <div class="date">${post_date}</div>
                    </div>`
        });
       console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    
}

logout_btn.addEventListener("click",()=>{
    window.localStorage.clear();
    window.location.replace("http://localhost/facebook_frontend/index.html");
});

function findFriends(sendEvent){
    axios.post('../../facebook_backend/PHP/search.php', 
    {
        user_id:`${id}`

    }
    ).then(function (response) {
        
        add_post_div.innerHTML=`
        <div id="find_friends" class="filter">
            <div class="find-friends">
                <div class="ff-header">
                    <h2 style="padding-left:40px">Find Friends</h2>
                    <i class="action-button fa-solid fa-xmark" id="delete" style="color:#ea4337;font-size:1.5rem"></i>
                </div>
                <div class="container-find" id="container_find">
                </div>
            </div>
        </div>`
        document.getElementById("delete").addEventListener("click",()=>{
            add_post_div.innerHTML="";
        });
        let container_find=document.getElementById("container_find");
        response.data.forEach(user => {

            container_find.innerHTML+=`
            <div class="notification-item" id="user_${user.user_id}">
                <div class="action-left">
                    <div class="not-profile-picture">
                        <img src="assets/ProfilePicture.png" alt="profile pic">
                    </div>
                    <div class="not-profile-name">
                        <p>${user.user_name}</p>
                    </div>
                </div>
                <div class="action-right">
                    <div class="action">
                        <i class="fa-solid fa-user-plus send-icon" id="${user.user_id}" style="color:#25e55f;font-size:1rem"></i>&nbsp&nbsp&nbsp&nbsp
                        <i class="fa-solid fa-user-large-slash" id="block_${user.user_id}" style="color:#ea4337;font-size:1rem"></i>
                    </div>
                </div>
            </div>`
        });
        return sendEvent();
    })
    .catch(function (error) {
        console.log(error);
    });
   
    
}

async function sendEvent(){
    let arr_icons=document.getElementsByClassName("send-icon");

    for (var i=0;i<arr_icons.length;i++){
        arr_icons[i].addEventListener("click",(e)=>{
        x(e.target.id);
    
    });
    
    }

}


function x(e){
    axios.post('../../facebook_backend/PHP/send_request.php', 
    {
        user_id:`${id}`,
        to_user_id:`${e}`,
        action:`send`

    }
    ).then(function (response) {
        console.log(response);
        document.getElementById(`user_${e}`).innerHTML="";
    })
    .catch(function (error) {
        console.log(error);
    });
}

