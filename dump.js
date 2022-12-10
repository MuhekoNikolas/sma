
userObjectTemplate = {
    displayName: "",
    uniqueName: "",
    uniqueId: "",
    pfp: "",
    url: "/users/{uniqueName}",
    joinDate: "",
    postCount: 0,

    banned: false,
    admin: false,

    badges: {
        0: {
            name: "Star badge",
            icon: "fa-star",
            cssColor: "yellow",
            priority:5,
        }
    }
}


badges = [
    {
        name:"Online",
        icon:"fa-circle",
        cssColor:"lime",
        priority:1
    }
]
postObjectTeplate = {
    uniqueId: "",
    title: "hi",
    textContent: "This is a blog Heading Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et. This is blog text content sed do eiusmod tempor incididunt ut labore et. This is a blog Heading Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do e",
    url: "",
    uploadedOn:"",
    author: {
        displayName: "",
        uniqueName: "",
        pfp: "",
        url: "/users/@mia",
        badges: {
            0: {
                name: "Star badge",
                icon: "fa-star",
                cssColor: "yellow"
            },
            1: {
                name: "Admin badge",
                icon: "fa-gavel",
                cssColor: "cyan"
            }
        }

    }
}

tokensDBTemplate = {
    token: "",
    hashedPassword:"",
    user: userObj
}



function newPost(obj){
    postDiv = document.createElement("div")
    postDiv.setAttribute("class", "postObjectPreview showPost")

    postDivButton = document.createElement("button")
    postDivButton.setAttribute("class", "postActionMenuButton")
    postDivButton.setAttribute("onclick", `alert('You clicked the option menu for ${obj.title}')`)
    postDivButtonSpan = document.createElement("span")
    postDivButtonSpan.setAttribute("class", "fa-solid fa-ellipsis")
    postDivButton.append(postDivButtonSpan)
    postDiv.append(postDivButton)

    postDivUploadedDate = document.createElement("p")
    postDivUploadedDate.setAttribute("class", "postObjectCreatedAtDate")
    postDivUploadedDate.textContent = obj.uploadedOn
    postDiv.append(postDivUploadedDate)

    postDivAuthorDetails = document.createElement("div")
    postDivAuthorDetails.setAttribute("class","postObjectAuthorDetails")
    postDivAuthorDetailsPfp = document.createElement("div")
    postDivAuthorDetailsPfp.setAttribute("class", "postObjectAuthorPfp")
    postDivAuthorDetailsPfp.setAttribute("style", `background-image: url('${obj.author.pfp}');`)
    postDivAuthorDetails.append(postDivAuthorDetailsPfp)
    postObjectAuthorUsernames = document.createElement("div")
    postObjectAuthorUsernames.setAttribute("class", "postObjectAuthorUsernames")
    postObjectAuthorUsernames.setAttribute("onclick", `redirect('${obj.author.url}')`)
    postObjectAuthorDisplayName = document.createElement("h1")
    postObjectAuthorDisplayName.setAttribute("class", "postObjectAuthorDisplayName")
    postObjectAuthorDisplayName.textContent = obj.author.displayName
    postObjectAuthorUsernames.append(postObjectAuthorDisplayName)
    postObjectAuthorUniqueName = document.createElement("h3")
    postObjectAuthorUniqueName.setAttribute("class", "postObjectAuthorUniqueName")
    postObjectAuthorUniqueName.textContent = obj.author.uniqueName 
    postObjectAuthorUsernames.append(postObjectAuthorUniqueName)
    postDivAuthorDetails.append(postObjectAuthorUsernames)

    postObjectAuthorBadges = document.createElement("div")
    postObjectAuthorBadges.setAttribute("class", "postObjectAuthorBadges")
    for(badgeInd of Object.keys(obj.author.badges)){ 
        badge = post.author.badges[badgeInd]
        i  = document.createElement("i")
        i.setAttribute("title", obj.name)
        i.setAttribute("style", `color: ${obj.cssColor};`)
        i.setAttribute("class", `postAuthorBadge fa-solid ${obj.icon}`)
        postObjectAuthorBadges.append(i)
    }
    postDivAuthorDetails.append(postObjectAuthorBadges)
    postDiv.append(postDivAuthorDetails)

    postObjectPreviewContent = document.createElement("div")
    postObjectPreviewContent.setAttribute("class", "postObjectPreviewContent")
    postObjectPreviewContent.setAttribute("style", "white-space:pre-line !important;")
    postObjectPreviewContentA1 = document.createElement("a")
    postObjectPreviewContentA1.setAttribute("style", "text-decoration:none;")
    postObjectPreviewContentA1.setAttribute("href", obj.url)
    postObjectPreviewTitle = document.createElement("h1")
    postObjectPreviewTitle.setAttribute("class", "postObjectPreviewTitle")
    postObjectPreviewTitle.textContent = obj.title 
    postObjectPreviewContentA1.append(postObjectPreviewTitle)
    postObjectPreviewContent.append(postObjectPreviewContentA1)
    postObjectPreviewContentH2 = document.createElement("h2")
    postObjectPreviewContentH2.setAttribute("class", "postObjectPreviewTextContent")
    postObjectPreviewContentH2.textContent = obj.textContent
    postObjectPreviewContent.append(postObjectPreviewContentH2)
    postObjectPreviewContentA2 = document.createElement("a")
    postObjectPreviewContentA2.setAttribute("class", "readmore")
    postObjectPreviewContentA2.setAttribute("href", obj.url)
    postObjectPreviewContentA2.textContent = "read more"
    postObjectPreviewContent.append(postObjectPreviewContentA2)
    postDiv.append(postObjectPreviewContent)

    return postDiv
}