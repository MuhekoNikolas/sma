

function markUrls(){
    postContentTextDiv = document.querySelector(".postTextContentText")
    if(postContentTextDiv==null){return}
    postContent =  postContentTextDiv.innerText
    
    urlFinderRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

    foundUrls = postContent.match(urlFinderRegex)
    if(foundUrls == null){return}

    postContentTextDiv.innerText = ""

    lastIndex = 0
    for(let url of foundUrls){
        createImage = false

        urlStartsAt = postContent.indexOf(url)
        urlEndsAt = postContent.indexOf(url) + url.length

        url = postContent.substring(urlStartsAt, urlEndsAt)


        if( postContent.substring(urlStartsAt-2, urlStartsAt) == "[<" && postContent.substring(urlEndsAt, urlEndsAt+2) == ">]" ){
            urlEndsAt+=2
            urlStartsAt -= 2

            createImage = true
        }
        //console.log(postContent.substring(urlStartsAt-2, urlStartsAt), postContent.substring(urlEndsAt, urlEndsAt+2))


        freeContent = postContent.substring(lastIndex, urlStartsAt)


        freeContentSpan = document.createElement("span")
        freeContentSpan.innerText = freeContent
        postContentTextDiv.append(freeContentSpan)

        if(createImage == false){
            urlAnchor = document.createElement("a")
            urlAnchor.setAttribute("href", url)
            urlAnchor.setAttribute("target", "_blank")
            urlAnchor.classList.add("postPageContentTextUrl")
            urlAnchor.innerText =  url
            postContentTextDiv.append(urlAnchor)
        } else {
            image = document.createElement("img")
            image.setAttribute("src", url)
            image.classList.add("postPageContentTextImage")
            postContentTextDiv.append(image)
        }

        lastIndex = urlEndsAt
        postContent = postContent.substring(lastIndex-2, postContent.length)
        lastIndex = 2
        
    }
}


function markStuff(){
    markUrls()
}
markStuff()