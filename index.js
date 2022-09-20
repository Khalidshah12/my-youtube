
const right_container = document.querySelector('#right-container');
const vert_Nav = document.querySelector('#vert-nav');

// function on menu button to view details of left side vertical navabr START
let i = 0
let menu = () => {

    if (i == 0) {
        i = 1
        right_container.style.marginLeft = "30px"

        vert_Nav.innerHTML = `<div id="homeDiv" onclick="homeDiv()"><i class="fa-solid fa-house"></i><br> Home</div>
        <div id="exploreDiv" onclick="exploreDiv()"><i class="fa-solid fa-compass"></i><br> Explore</div>
        <div id="shortsDiv" onclick="shortsDiv()"><i class="fa-solid fa-play"></i><br> Shorts</div>
        <div id="subscriptionDiv" onclick="subscriptionDiv()"><i class="fa-solid fa-hand-pointer"></i><br>Subscription</div>
        <div id="library" onclick="library()"><i class="fa fa-forward"></i><br> Library</div>`
        vert_Nav.style.paddingLeft = "0px"
    }
    else {
        i = 0
        right_container.style.marginLeft = "0px"

        vert_Nav.innerHTML = `<div id="homeDiv" style="margin-bottom: 50px;" onclick="homeDiv()"><i class="fa-solid fa-house"></i><br></div>
        <div id="exploreDiv" style="margin-bottom: 50px;" onclick="exploreDiv()"><i class="fa-solid fa-compass"></i><br></div>
        <div id="shortsDiv" style="margin-bottom: 50px;" onclick="shortsDiv()"><i class="fa-solid fa-play"></i><br></div>
        <div id="subscriptionDiv" style="margin-bottom: 50px;" onclick="subscriptionDiv()"><i class="fa-solid fa-hand-pointer"></i><br></div>
        <div id="library" onclick="library()"><i class="fa fa-forward"></i><br></div>`

        vert_Nav.style.paddingLeft = "30px"
    }
}
// function on menu button to view details of left side vertical navabr END


// fetch for trending videos
let popularVideo = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=IN&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res.items)
        displayTrending(res.items)

        const filterSelect = document.querySelector('#filterSelect');
        filterSelect.addEventListener("change", filterSelectFun)

        function filterSelectFun() {

            let selected = document.querySelector("#filterSelect").value;
            if (selected == "none") {
                displayTrending(res.items)
            }

            else if (selected == "10M") {
                let data = res.items
                let filtered = data.filter(function (elem) {
                    return Number(elem.statistics.viewCount) > 10000000;
                });
                displayTrending(filtered);
            }

            else if (selected == "5M") {
                let data = res.items
                let filtered = data.filter(function (elem) {
                    return Number(elem.statistics.viewCount) > 5000000;
                });
                displayTrending(filtered);
            }

            else if (selected == "below5M") {
                let data = res.items
                let filtered = data.filter(function (elem) {
                    return Number(elem.statistics.viewCount) < 5000000;
                });
                displayTrending(filtered);
            }
        }

        // console.log(typeof Number(res.items[0].statistics.viewCount))
    }).catch(function (err) {
        console.log(err)
    })
}
popularVideo()

// display trending data on home page
let displayTrending = (data) => {
    const preview = document.querySelector('#preview');
    preview.innerHTML = ""
    data.forEach(function ({ id, snippet: { title, thumbnails: { medium: { url } } } }) {

        const movieBox = document.createElement('div');
        movieBox.setAttribute("id", "movieBox")

        const titles = document.createElement('h4');
        titles.innerText = title

        const image = document.createElement('img');
        image.src = url

        movieBox.append(image, titles)
        preview.append(movieBox)

        let t = title
        let i = id
        let video = {
            t,
            i,
        }
        movieBox.onclick = () => {
            playVideo(video)
        }
    })
}

// fetch for search suggestion 
let SearchSug = () => {
    const searchInput = document.querySelector('#searchInput').value;
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchInput}&key=${key}`
    if (searchInput != "") {
        fetch(url).then(function (res) {
            return res.json()
        }).then(function (res) {
            console.log(res)
            displayForSuggestion(res.items)
        }).catch(function (err) {
            console.log(err)
        })
    } else {
        var suggestion = document.getElementById('suggestion');
        suggestion.style.display = 'none';
    }
}

// added debauncing with delay of 0.5s
let id;
let debauncing = (func, delay) => {
    if (id) {
        clearTimeout(id)
    }
    id = setTimeout(function () {
        func()
    }, delay)
}

// appending data in search suggestion div
let displayForSuggestion = (data) => {
    const appendSuggestion = document.querySelector('#appendSuggestion');
    appendSuggestion.innerHTML = null
    let suggestion = document.createElement("div")
    suggestion.setAttribute("id", "suggestion")
    suggestion.innerHTML = null
    data.forEach(function ({ snippet: { title } }) {

        const sugg = document.createElement('div');
        sugg.setAttribute("class", "sugg")

        sugg.addEventListener("click", function () {
            searchData(data)
        })

        const sugTitle = document.createElement('p');
        sugTitle.setAttribute("id", "sugTitle")
        sugTitle.innerText = title

        sugg.append(sugTitle)
        suggestion.append(sugg)

        appendSuggestion.append(suggestion)
    })
}

// function for getting data by clicking on search suggestion
let searchData = (data) => {
    const preview = document.querySelector('#preview');
    preview.innerHTML = null

    display(data)
    var suggestion = document.getElementById('suggestion');
    suggestion.style.display = 'none';
}


// function for unhide suggestion list after clicking outside
document.addEventListener('mouseup', function (e) {
    var suggestion = document.getElementById('suggestion');
    if (!suggestion.contains(e.target)) {
        suggestion.style.display = 'none';
    }
});


// search function
let getData = () => {
    const searchInput = document.querySelector('#searchInput').value;

    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"

    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchInput}&key=${key}`

    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}

// apending data in container
let display = (data) => {
    const preview = document.querySelector('#preview');
    preview.innerHTML = ""
    data.forEach(function ({ id: { videoId }, snippet: { title, thumbnails: { medium: { url } } } }) {
        // data.forEach(function (elem) {

        const movieBox = document.createElement('div');
        movieBox.setAttribute("id", "movieBox")

        const titles = document.createElement('h4');
        titles.innerText = title

        const image = document.createElement('img');
        image.src = url

        movieBox.append(image, titles)
        preview.append(movieBox)

        let t = title
        let i = videoId
        let video = {
            t,
            i,
        }
        movieBox.onclick = () => {
            playVideo(video)
        }
    })
}

// save data in local Storage for play video on another page
let playVideo = (video) => {
    localStorage.setItem("video", JSON.stringify(video))
    window.location.href = "./viewvideo.html"
}



// function for vertical navbar START
let ytIcon = () => {
    window.location.href = "./index.html"
}

let homeDiv = () => {
    window.location.href = "./index.html"
}

let exploreDiv = () => {
    window.location.href = "./dummy.html"
}

let shortsDiv = () => {
    window.location.href = "./dummy.html"
}

let subscriptionDiv = () => {
    window.location.href = "./dummy.html"
}

let library = () => {
    window.location.href = "./dummy.html"
}

let signin = () => {
    window.location.href = "./dummy.html"
}

// function for vertical navbar END


// functions for Search by given buttons
let allButton = () => {
    window.location.href = "./index.html"
}

// for live
let live = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=live&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}


// for playlists
let playlists = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=playlists&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })

}

// for bollywoodMusic
let bollywoodMusic = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=bollywoodMusic&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}

// for comedies
let comedies = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=comedies&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}

// for tamilCinema
let tamilCinema = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=tamilCinema&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}
// for music
let music = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=music&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}

// for t_sereis
let t_sereis = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=t_sereis&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}

// for gaming
let gaming = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=gaming&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}

// for javaScript
let javaScript = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=javaScript&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}

// for trailers
let trailers = () => {
    let key = "AIzaSyArFP6irBck0G7zxpbXAZIkD5-lMo69BZ8"
    let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=trailers&key=${key}`
    fetch(url).then(function (res) {
        return res.json()
    }).then(function (res) {
        console.log(res)
        display(res.items)
    }).catch(function (err) {
        console.log(err)
    })
}
