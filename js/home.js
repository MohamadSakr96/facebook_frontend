let id=localStorage.getItem("id");
let search=document.getElementById("find_friends");
let my_posts=document.getElementById("my_posts");

search.addEventListener("click",findFriends);
my_posts.addEventListener("click",getUserPosts);

console.log(id);

const user_info_request = axios.post('../../facebook_backend/PHP/user_info.php', {user_id:`${id}`});
const notifications_request =  axios.post('../../facebook_backend/PHP/friend_requests.php', {user_id:`${id}`});
const posts_request = axios.post('../../facebook_backend/PHP/get_posts.php', {user_id:`${id}`});


async function getFeed(){
await axios.all([user_info_request, notifications_request, posts_request]).then(axios.spread(function(res1, res2, res3) {
  console.log(res1);
  console.log(res2);
  console.log(res3);
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