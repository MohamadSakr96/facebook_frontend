let id=localStorage.getItem("id");
let search=document.getElementById("find_friends");
let my_posts=document.getElementById("my_posts");
let profile_info=document.getElementById("profile_info");
let notifications=document.getElementById("notification");
let content=document.getElementById("content");

let img_path="../../facebook_backend/images/";

search.addEventListener("click",findFriends);
my_posts.addEventListener("click",getUserPosts);

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
getFeed();

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


    friend_requests_response.data.forEach(user => {
        notifications.innerHTML+=` 
        <div class="notification-item">
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
                    <button class="action-button">+</button>
                    <button class="action-button">-</button>
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