window.onload = function() {
    
    // Video
    var video = document.getElementById("myvideo");

    var play = document.getElementById("play");
    var currenttime = document.getElementById("currenttime");
    var endtime = document.getElementById("endtime");
    var vol = document.getElementById("volume");
    var volbar = document.getElementById("volbar");
    var volbarback = document.getElementById("volbarback");
    var seek = document.getElementById("seek");
    var playicon = document.getElementById("playicon");
    var seekback = document.getElementById("seekback");
    var fullscreen = document.getElementById("fullscreen");
    var testyfull = document.getElementById("testyfull");
    var fullicon = document.getElementById("fullicon");
    var controls = document.getElementById("controls");

    seek.draggable = true;

    /*seek.ondrag(function(e){
        var posx = e.clientX - 120;
        video.currentTime = (posx/1280)*video.duration;
    });*/

    /*seek.addEventListener("drag", function(e){
        var posx = e.clientX - 120;
        //seek.style.width = (posx/1280)*100+"%";
        video.currentTime = (posx/1280)*video.duration;
    });*/

    video.addEventListener("mousedown", function(){
        if(video.paused)
        {
            video.play();
            playicon.className = "fa fa-pause";
        }
        else
        {
            video.pause();
            playicon.className = "fa fa-play";
        }
    });

    seekback.addEventListener("mousedown", function(e){
        var down = true;
        var fullscr = false;
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        )
        {
            //video.currentTime = (e.clientX/screen.width)*video.duration;
            fullscr = true;
        }
        else
        {
            //var posx = e.clientX - 120;
            //video.currentTime = (posx/1280)*video.duration;
        }
        document.addEventListener("mouseup", function(){
            down=false;
        })
        this.onmousemove = function(e){
            if(down){
                if(fullscr){
                    video.currentTime = (e.clientX/screen.width)*video.duration;
                }
                else{
                    video.currentTime = ((e.clientX - 120)/1280)*video.duration;
                }
            }
        }
    });

    play.addEventListener("click", function(){
        if(video.paused)
        {
            video.play();
            playicon.className = "fa fa-pause";
        }
        else
        {
            video.pause();
            playicon.className = "fa fa-play";
        }
    });

    currenttime.innerHTML = formatTime(video.currentTime)+"";
    video.addEventListener('timeupdate', function() {
        currenttime.innerHTML = formatTime(video.currentTime)+"";
        seek.style.width = ((video.currentTime / video.duration)*100)+"%";
    });

    video.addEventListener('durationchange', function() {
        endtime.innerHTML = formatTime(video.duration)+"";
    });
    endtime.innerHTML = formatTime(video.duration)+"";

    vol.addEventListener("mousedown", function(){
        video.muted = !video.muted;
    });

    volbarback.addEventListener("mousedown", function(e){
        var fullscr = false;
        var posx=0;
        var down=true;
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        )
        {
            //var posx = e.clientX - 264;
            fullscr = true;
        }
        else
        {
            //var posx = e.clientX - 384;
        }

        document.addEventListener("mouseup", function(){
            down=false;
        })
        this.onmousemove = function(e){
            if(fullscr){
                posx = e.clientX - 264;
            }
            else{
                posx = e.clientX - 384;
            }
            if(down) video.volume = posx/100;
        }
    });

    video.addEventListener('volumechange', function(){
        volbar.style.width = 100*video.volume+"%";
        /*if(this.volume > 0.7){
            volicon.innerHTML = "volume_up";
        }else if(this.volume > 0.3){
            volicon.innerHTML = "volume_down";
        }else if(this.volume > 0){
            volicon.innerHTML = "volume_mute";
        }else{
            volicon.innerHTML = "volume_off";
        }*/
        if(video.muted){
            volicon.innerHTML = "volume_off";
        }else{
            if(this.volume > 0.5){
                volicon.innerHTML = "volume_up";
            }else if(this.volume > 0){
                volicon.innerHTML = "volume_down";
            }else{
                volicon.innerHTML = "volume_mute";
            }
        }
    });
    volbar.style.width = 100*video.volume+"%";

    fullscreen.addEventListener("click", function(){
        // are we full-screen?
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        )
        {
            // exit full-screen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            fullicon.innerHTML = "fullscreen";
        }
        else
        {
            if (testyfull.requestFullscreen) {
                testyfull.requestFullscreen();
            } else if (testyfull.mozRequestFullScreen) {
                testyfull.mozRequestFullScreen(); // Firefox
            } else if (testyfull.webkitRequestFullscreen) {
                testyfull.webkitRequestFullscreen(); // Chrome and Safari
            } else if (testyfull.msRequestFullscreen) {
                testyfull.msRequestFullscreen();
            }
            fullicon.innerHTML = "fullscreen_exit";
        }
    })

    /*var timeout;
    document.onmousemove = function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){controls.style.opacity = 0;, 200);
    }*/
}

function formatTime(secs){
    var s = Math.round(secs);
    var mins = Math.floor(secs/60);
    s -= mins*60;
    if(mins < 10)
    {
        mins = "0"+mins;
    }
    if(s < 10)
    {
        s = "0"+s;
    }
    return mins + ":" + s;
}

function togglePause(video){
    if(video.paused)
    {
        video.play();
        playicon.className = "fa fa-pause";
    }
    else
    {
        video.pause();
        playicon.className = "fa fa-play";
    }
}
