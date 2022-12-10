

function heightenFields(){
    growTextArea(document.querySelector(".editPostMenuTitleInput"))
    growTextArea(document.querySelector(".editPostMenuContentInput"))
}

function editPostDataDb(authorId, postId){
    postTitleInput = document.querySelector(".editPostMenuTitleInput")
    postContentInput = document.querySelector(".editPostMenuContentInput")
    if(postTitleInput == null || postContentInput == null){
        newAlertBlock("Either Post Title or Post Content returned null.")
        return
    }
    postTitle = postTitleInput.value
    postContent = postContentInput.value
    if(postTitle.length < 1 || postContent.length < 1){
        newAlertBlock("Fields can't be blank.")
        return
    }

    obj= {
        authorId,
        postId,
        postTitle,
        postContent,
    }

    options= {
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }

    fetch("/api/posts/update", options)
    .then(resp=>resp.json(0))
    .then(data=>{
        console.log(data,"hi")
        if(data.success != true){
            newAlertBlock(data.message)
            return
        }

        newAlertBlock(data.message)
  
    })
}