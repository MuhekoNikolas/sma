

function markUrls(){
    markedUrlsAndText = []

    postContentTextDiv = document.querySelector(".postTextContentText")
    if(postContentTextDiv==null){return}
    postContent =  postContentTextDiv.innerText
    
    urlFinderRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

    foundUrls = postContent.match(urlFinderRegex)
    if(foundUrls == null){return}

    //postContentTextDiv.innerText = ""

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


        freeContent = postContent.substring(lastIndex, urlStartsAt)
        freeContentSpan = document.createElement("span")
        freeContentSpan.innerText = freeContent
        //postContentTextDiv.append(freeContentSpan)
        markedUrlsAndText.push({element:freeContentSpan, type:"span"})

        if(createImage == false){
            urlAnchor = document.createElement("a")
            urlAnchor.setAttribute("href", url)
            urlAnchor.setAttribute("target", "_blank")
            urlAnchor.classList.add("postPageContentTextUrl")
            urlAnchor.innerText =  url
            //postContentTextDiv.append(urlAnchor)
            markedUrlsAndText.push({element:urlAnchor, type:"url"})
        } else {
            image = document.createElement("img")
            image.setAttribute("src", url)
            image.classList.add("postPageContentTextImage")
            markedUrlsAndText.push({element:image, type:"url"})
            //postContentTextDiv.append(image)
        }
        
        lastIndex = urlEndsAt
        postContent = postContent.substring(lastIndex-2, postContent.length)
        lastIndex = 2
    }

    lastContent = postContent.substring(2, postContent.length)
    lastContentSpan = document.createElement("span")
    lastContentSpan.innerText = lastContent
    //postContentTextDiv.append(lastContentSpan)
    markedUrlsAndText.push({element:lastContentSpan, type:"span"})

    //console.log(postContent.substring(2, postContent.length))

    return markedUrlsAndText

}

function markColor(obj){
    element = obj.element 
    elementToReturn = document.createElement("span")

    elText = element.innerText

    colorRegex = /\[<%#?(\w)+>\]/g
    colorMatches = elText.match(colorRegex)
    //console.log(colorMatches, elText)
    if(colorMatches == null ){return obj}


    lastIndex = 0
    for(colorMatch of colorMatches){
        color = colorMatch.substring(3, colorMatch.length-2)

        openTagIndex = elText.indexOf(colorMatch, 1)
        closeTagIndex = elText.indexOf(`[<%${color}%>]`, 1)

        if(closeTagIndex == -1){
            closeTagIndex = openTagIndex + (colorMatches.length-2)
        }

        if(openTagIndex == -1){
            openTagIndex = 0
        }

        uncoloredText = document.createElement("span")
        uncoloredText.innerText = elText.substring(lastIndex, openTagIndex)
        elementToReturn.append(uncoloredText)

        textToColor = elText.substring(openTagIndex+colorMatch.length, closeTagIndex).trim()

        //console.log(textToColor, openTagIndex, colorMatch, color, closeTagIndex, elText.substring(openTagIndex, closeTagIndex+(colorMatch.length+1)))

        coloredText = document.createElement("span")
        coloredText.innerText = textToColor
        coloredText.style.color  = color 
        elementToReturn.append(coloredText)

        lastIndex = closeTagIndex+(colorMatch.length+1)
        elText = elText.substring(lastIndex, elText.length)
        lastIndex = 0
    }

    lastText = document.createElement("span")
    lastText.innerText = elText.substring(lastIndex, elText.length)
    elementToReturn.append(lastText)

    obj = {
        element:elementToReturn
    }
    return obj
}


function markStuff(){
    postContentTextDiv = document.querySelector(".postTextContentText")

    markedUrlsAndText = markUrls()
    newMarkedUrlsAndText = []

    for(markedUrlAndTextObj of markedUrlsAndText){
        if(markedUrlAndTextObj.type == "span"){
            newSpanObj = markColor(markedUrlAndTextObj)
           newMarkedUrlsAndText.push(newSpanObj)
        } else {
            newMarkedUrlsAndText.push(markedUrlAndTextObj)
        }
    }

    postContentTextDiv.innerText = ""
    newMarkedUrlsAndText.forEach(el=>{
        postContentTextDiv.append(el.element)
    })
}
markStuff()