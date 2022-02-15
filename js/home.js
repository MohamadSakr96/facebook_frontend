let id=localStorage.getItem("id");
console.log(id);
const user_info_request = axios.post('../../facebook_backend/PHP/user_info.php', {user_id:`${id}`});
const notifications_request =  axios.post('../../facebook_backend/PHP/friend_requests.php', {user_id:`${id}`});
const posts_request = axios.post('../../facebook_backend/PHP/get_posts.php', {user_id:`${id}`});
// you could also use destructuring to have an array of responses
async function getFeed(){
await axios.all([user_info_request, notifications_request, posts_request]).then(axios.spread(function(res1, res2, res3) {
  console.log(res1);
  console.log(res2);
  console.log(res3);
}));
}
getFeed();