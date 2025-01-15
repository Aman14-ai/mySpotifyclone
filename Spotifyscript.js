// console.log("Lets write the java script configuration for the project");


let currentSong = new Audio();
const ehsaan = "128-Ehsan Tera Hoga Mujh Par - Junglee (1961) 128 Kbps.mp3";

let songs;
let currFolder;


async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    // console.log(a)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    // console.log(as)
    songs = [];

    for (let index = 3; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songOL = document.querySelector('.songLists').getElementsByTagName('ol')[0];
    songOL.innerHTML = " ";
    for (const song of songs) {
        songOL.innerHTML = songOL.innerHTML + `
                    <li>
                        <img src="music.svg" alt="">
                        <div class="songCard flex justify-center align-center">
                        <div class="info">
                            <div class= "songName">${song.replaceAll('%20', ' ').replace('.unknown', " ")}</div>
                            <div style="font-size: 13px;"><b>Artist</b> : Aman choudhary</div>
                        </div>
                        <div class="playNow">
                            <img class="invert" src="play2.svg" alt="" height="30">
                        </div>
                        </div>
                    </li>`;

    }


    Array.from(document.querySelector('.songLists').getElementsByTagName('li')).forEach(e => {
        currentSong.src = `${currFolder}/` + songs[0];
        document.querySelector('.songinfo').innerHTML = (`${currFolder}/` + songs[0]).split('/')[2].replaceAll("%20", " "); // http://127.0.0.1:5500/songs/HindiEmotional/128-Luka%20Chuppi%20-%20Rang%20De%20Basanti%20128%20Kbps.mp3
        // console.log("first time source is "+ currentSong.src)
        e.addEventListener('click', () => {
            // console.log("the value am is" +  e.getElementsByClassName('songName')[0].innerHTML);
            playMusic(e.getElementsByClassName('songName')[0].innerHTML.trim());
        });
    });
    currentSong.addEventListener('timeupdate', () => {
        // console.log(Math.floor(currentSong.currentTime.toLocaleString()) , Math.floor(currentSong.duration.toLocaleString()))
        document.querySelector('.songtime').innerHTML = `${(convertToMinutesAndSeconds(Math.floor(currentSong.currentTime.toLocaleString())))}/${(convertToMinutesAndSeconds(Math.floor(currentSong.duration.toLocaleString())))}`;
        document.querySelector('.circle').style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%";

    });

    document.querySelector('.seekbar').addEventListener('click', (e) => {
        // console.log(e.offsetX, e.target.offsetWidth);
        // console.log(e.target.offsetWidth , e.target.getBoundingClientRect().width);
        // console.log((e.offsetX / e.target.offsetWidth)*100)
        // console.log("The percentage that i have clicked is at : " + (e.offsetX/e.target.getBoundingClientRect().width)*100);
        // console.log(e.target)
        // console.log(e.target.getBoundingClientRect().width);
        currentSong.currentTime = (e.offsetX / e.target.offsetWidth) * currentSong.duration;
        document.querySelector('.circle').style.left = (e.offsetX / e.target.offsetWidth) * 100 + "%";
    })

}

// console.log(songs)



// const arr = getSongs(); // returns a promise.
// console.log(arr);

document.querySelector('.songtime').innerHTML = "00:00/00:00";


const playMusic = (element) => {
    // console.log("The element that is need to pass in playmusic fuction is:  " + element);
    currentSong.src = `${currFolder}/` + element;
    // console.log("currensong.src is: " + currentSong.src);
    currentSong.play();
    playButton.src = "pause.svg";
    document.querySelector('.songinfo').innerHTML = element;
    document.querySelector('.songNameDisplay').innerHTML = element;
}


async function displayAlbums() {
    console.log(" i am in displayAlbums function");
    let a = await fetch('http://127.0.0.1:5500/songs/')
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    // console.log(div);
    let anchor = div.getElementsByTagName('a');
    // console.log(anchor);
    let array = Array.from(anchor);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes('/songs/')) {
            let folder = e.href.split('/songs/')[1];
            // get the metadata from the folder
            console.log(folder);
            let a2 = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response2 = await a2.json();
            console.log(response2);
            let cardContainer = document.querySelector('.card-container');
            cardContainer.innerHTML = cardContainer.innerHTML +
                `<div data-folder=${folder} class="card">
                    <div class="play-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                            <polygon points="8,5 19,12 8,19" fill="black" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpeg" alt="img" width="100%">
                    <h3>${response2.title}</h3>
                    <p>${response2.description}</p>
                </div>`
        }
    }
    //   Loading the playlist when clicked on the card.

Array.from(document.getElementsByClassName('card')).forEach((element) => {
    console.log(element)
    element.addEventListener('click', async (item) => {
        // console.log("card clicked")
        // console.log("item is " + item);
        // console.log(item.target);
        // console.log(item.currentTarget.dataset)
        // console.log(`songs/${item.currentTarget.dataset.folder}`)
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    })
});
}


async function main() {

    // get the list of all songs.
    await getSongs("songs/HindiEmotional");
    // Display all the albums on the page.

    displayAlbums();

    playButton.addEventListener('click', () => {
        if (currentSong.paused) {
            // console.log("song starts playing");
            playButton.src = "pause.svg";
            currentSong.play();

        } else if (currentSong.played) {
            // console.log("song paused");
            playButton.src = "play.svg";
            currentSong.pause();
        }
    });
    let next = document.querySelector('.forwardSong');
    document.querySelector('.prevSong').addEventListener('click', () => {
        // console.log("previous song is clicked");
        // console.log(currentSong);
        if (songs.indexOf(currentSong.src.split(`${currFolder}/`)[1]) == 0) {
            console.log("I am at the first song");
            console.log(songs)
            currentSong.src = "/songs/" + songs[1];
            playMusic(currentSong.src.split('/songs/')[1].replaceAll('%20', ' ').trim())
        }
        currentSong.src = "/songs/" + songs[songs.indexOf(currentSong.src.split(`${currFolder}/`)[1]) - 1];
        playMusic(currentSong.src.split('/songs/')[1].replaceAll('%20', ' ').trim());


    });
    next.addEventListener('click', () => {
        // console.log("next song is clicked")
        // console.log("currentSong.src is :" + currentSong.src);
        // console.log(songs)
        // console.log("index of current song is : " + songs.indexOf(currentSong.src.split('/songs/')[1]));
        if (songs.indexOf(currentSong.src.split(`${currFolder}/`)[1]) == songs.length - 1) {
            console.log("I am at the last song");
            console.log(songs)
            currentSong.src = `/songs/` + songs[0];
            playMusic(currentSong.src.split('/songs/')[1].replaceAll('%20', ' ').trim())
        }

        else {
            currentSong.src = "/songs/" + songs[songs.indexOf(currentSong.src.split(`${currFolder}/`)[1]) + 1];
            console.log("currentSong.src in next button  is :" + currentSong.src);
            // console.log(currentSong.src.split('/songs/')[1].replaceAll('%20' , ' '));

            // playMusic(currentSong.src);  
            const element = currentSong.src.split('/songs/')[1].replaceAll('%20', ' ').trim()
            // console.log("element is " + element);

            playMusic(element);
        }
    });

}

main();


function convertToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

// add event listener to the play button.

const playButton = document.querySelector('.playSong');


// Add an event listener for hamburger 
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = "0"
});
document.querySelector('.crossSVG').addEventListener('click', () => {
    document.querySelector('.left').style.left = "-120%"
});


// Adding event listener to previous song and forward song.




document.querySelector('.inputRange').addEventListener('change', (e) => {
    // console.log(e.target.value);
    currentSong.volume = e.target.value / 100;
    document.querySelector('.volumeValue').innerHTML = e.target.value;
})
document.querySelector('.inputRangeInMedia').addEventListener('change', (e) => {
    // console.log(e.target.value);
    currentSong.volume = e.target.value / 100;
    document.querySelector('.volumeValue').innerHTML = e.target.value;
})

document.querySelector('.volumeImg').addEventListener('click', () => {
    if (currentSong.muted) {
        currentSong.muted = false;
        document.querySelector('.inputRange > input').value = 50;
        document.querySelector('.volumeImg').src = "volume-up.svg";
    } else {
        currentSong.muted = true;
        document.querySelector('.inputRange > input').value = 0;
        document.querySelector('.volumeImg').src = "volume-mute.svg";
    }
})
document.querySelector('.volumeInMediaImg').addEventListener('click', () => {
    if (currentSong.muted) {
        currentSong.muted = false;
        document.querySelector('.inputRangeInMedia > input').value = 50;
        document.querySelector('.volumeInMediaImg').src = "volume-up.svg";
    } else {
        currentSong.muted = true;
        document.querySelector('.inputRangeInMedia > input').value = 0;
        document.querySelector('.volumeInMediaImg').src = "volume-mute.svg";
    }
})



