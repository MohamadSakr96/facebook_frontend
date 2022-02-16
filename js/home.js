let id=localStorage.getItem("id");
let search=document.getElementById("find_friends");
let my_posts=document.getElementById("my_posts");
let profile_info=document.getElementById("profile_info");
let notifications=document.getElementById("notification");
let content=document.getElementById("content");
let create_post=document.getElementById("add_post");
let create_post_div=document.getElementById("add_post_div");

let img_path="../../images/";

search.addEventListener("click",findFriends);
my_posts.addEventListener("click",getUserPosts);
create_post.addEventListener("click",createPost);

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


getFeed().then(addEvents);

let action_array=document.getElementsByClassName("action-button");


async function addEvents(){
    
    for (var i=0;i<action_array.length;i++){
        action_array[i].addEventListener("click",(e)=>{
    
        let splitted_id=e.target.id.split("_");
        handleRequest(splitted_id[0],splitted_id[1]);
    
    });
    
    }

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
        console.log(error, "Couldn't get friends");
    });
}



function findFriends(){

    if(id===""){
        console.log("Id not defined");
    }else{
        axios.post('../../facebook_backend/PHP/search.php', 
        {
            user_id:`${id}`
        }
        ).then(function (response) {
           console.log(response)
            
        })
        .catch(function (error) {
            console.log(error, "Couldn't get friends");
        });

    }
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
            console.log(error, "Couldn't get friends");
        });

    }

}

function renderUserInfo(user_data_response){

    console.log(img_path);
    let y=`${img_path}${user_data_response.data[0].user_picture}`;
    console.log(y);
    profile_info.innerHTML=`
    <div class="profile-picture">
        <img src="${img_path}${user_data_response.data[0].user_picture}" alt="profile pic" width="100px">
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
                    <img src="${img_path}${user.user_picture}" alt="profile pic">
                </div>
                <div class="not-profile-name">
                    <p>${user.user_name}</p>
                </div>
            </div>
            <div class="action-right">
                <div class="action">
                    <i class="fa-solid fa-check action-button"  id="accept_${user.user_id}"></i>
                    <i class="action-button fa-solid fa-xmark" id="delete_${user.user_id}"></i>
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
        <div class="post" id="${post.post_id}">
        <div class="post-header">
            <div class="post-profile-picture">
                <img src="${img_path}${post.user_picture}" alt="profile pic">
            </div>
            <div class="post-profile-name">
                <h4>${post.user_name}</h4>
            </div>
        </div>
        <div class="post-content">
            <textarea id="1" class="textarea" readonly>${post.post_content}</textarea>
        </div>
        <div class="post-footer">
            <div class="likes">${post.nb_likes}</div>
            <div class="date">${post_date}</div>
        </div>
    </div>`
    });

}

async function createPost(){

    create_post_div.innerHTML=`<div id="create_post" class="filter">
    <div class="filter-post">
        <div class="filter-post-title">
            <h4>Create post</h4>
        </div>
        <div class="post-content">
            <textarea id="post_text" class="textarea" placeholder="Write your status here..."></textarea>
        </div>
        <div class="filter-post-footer">
            <button id="post_submit" class="btn create-post" type="button">Submit</button>
        </div>
    </div>
</div>`;
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


