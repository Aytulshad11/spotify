let currentSong = new Audio();
let songs;
let currFolder;
console.log("Lets do some javaScript")
function secondsToMinutesAndSeconds(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    
    // Add leading zeros if necessary
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
    // Combine minutes and seconds with a colon
    var formattedTime = formattedMinutes + ':' + formattedSeconds;
    
    return formattedTime;
}

async function getsongs(folder){
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[];
    for(let index = 0; index<as.length;index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    //show songs to th playlist
    let songUl= document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for(const song of songs){
        songUl.innerHTML = songUl.innerHTML + `<li>
                            <img src="music.svg" class ="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Aytul</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  src="play.svg" class="invert" alt="">
                            </div></li>`;
    }
    //attach an even listener to each sng
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=> {
        e.addEventListener("click", element => {
           // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        }) 
            } )
    return songs
}

const playMusic = (track, pause=false)=>{
    //let audio = new Audio("/songs/"+track)
    currentSong.src= `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg";
     }
    
   // play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}




async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        console.log("hii",e.href)
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            console.log(e.href)
            // Get the metadata of the folder
            console.log(`/songs/${folder}/coverr.jpg`);
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="cs" class="card">
            <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none">
            <path
                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                stroke="#000000" stroke-width="1.5" stroke-linejoin="round" fill="#000" />
        </svg>
    </div>
            
      <img src="/songs/${folder}/coverr.jpg" alt="">

            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}
async function main(){

    
    //list of all songs
     await getsongs("songs/ncs")
    playMusic(songs[0], true)

    //display all albums
    await  displayAlbums()
    
         //attach an event listenr to play prev and next  
         play.addEventListener("click", () =>{
            if(currentSong.paused){
                currentSong.play()
                play.src = "pause.svg";

            } else{
                currentSong.pause()
                play.src = "play.svg";

            }
         }) 

         //listen for time update
         currentSong.addEventListener('timeupdate', () => {
            //console.log(currentSong.currenttime, currentSong.duration);
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) *100 + "%";
        })

        //add eventlstener to seek bar
        document.querySelector(".seekbar").addEventListener("click", e=>{
            let percent = ( e.offsetX / e.target.getBoundingClientRect().width)*100;
            document.querySelector(".circle").style.left = ( e.offsetX / e.target.getBoundingClientRect().width)*100 + "%";
            currentSong.currentTime = ((currentSong.duration)* percent) /100 
        })

        //add eventlistenr for hamburger
        document.querySelector(".hamburger").addEventListener("click", ()=>{
            document.querySelector(".left").style.left = "0"
        })
         
        //add eventlistenr for close 
        document.querySelector(".close").addEventListener("click", ()=>{
            document.querySelector(".left").style.left = "-120%"
        })

        //add an event lsteer to prev 
        previous.addEventListener("click", ()=>{
          

           // let index = songs.indexOf(currentSong.src.split("/").slice(0, -1)[0])
           let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

           
            if((index-1) >= 0){
                playMusic(songs[index-1])
            }
        })
        //add an event lsteer to next
        next.addEventListener("click", ()=>{
          
           // let index = songs.indexOf(currentSong.src.split("/").slice(0, -1)[0])
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
           // currentSong.src.split("/").slice(-1)[0]
           // console.log(songs, index)
            if((index+1) < songs.length){
                playMusic(songs[index+1])
            }
        })

        //add an event to volume
        document.querySelector('.range').getElementsByTagName("input")[0].addEventListener("change", (e)=>{
          //  console.log(e, e.target, e.target.value)
            currentSong.volume= parseInt(e.target.value)/100;
        })

       


}
   
main()    


// // Get the audio element
// var audio = document.getElementById("myAudio");

// // Add an event listener to a button or any element that triggers audio playback
// document.getElementById("playButton").addEventListener("click", function() {
//     // Play the audio
//     audio.play()
//         .then(function() {
//             console.log('Audio playback started successfully');
//         })
//         .catch(function(error) {
//             console.error('Error starting audio playback:', error);
//         });
// });

