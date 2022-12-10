

postWrapper = (document.getElementById("postsWrapper") || document.querySelector(".userProfilePosts") ) || document.createElement("div")
posts = postWrapper.children

var postsObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        post = entry.target
  post.classList.toggle("showPost",entry.isIntersecting)
        //postsObserver.unobserve(post)
    })
},
{
    root:postWrapper,
    threshold:0.3
})

for(post of posts){
    postsObserver.observe(post)
}