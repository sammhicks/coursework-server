interface Document {
    msExitFullscreen: () => void;
    msFullscreenElement: Element;
    mozCancelFullScreen: () => void;
    mozFullScreenElement: Element;
}

interface Element {
    msRequestFullscreen: () => void;
    mozRequestFullScreen: () => void;
}

function formatTime(totalSeconds: number) {
    function formatTwoDigits(value: number) {
        return (value < 10 ? "0" : "") + value;
    }

    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds - minutes * 60);

    return formatTwoDigits(minutes) + ":" + formatTwoDigits(seconds);
}

function clamp(input: number, min: number, max: number) {
    if (input < min) return min;
    if (input > max) return max;
    return input;
}

window.onload = function () {
    // Video
    var video = <HTMLVideoElement>(document.getElementById("myvideo"));

    var play = document.getElementById("play");
    var currenttime = document.getElementById("currenttime");
    var endtime = document.getElementById("endtime");
    var vol = document.getElementById("volume");
    var volbar = document.getElementById("volbar");
    var volbarback = document.getElementById("volbarback");
    var volicon = document.getElementById("volicon");
    var seek = document.getElementById("seek");
    var playicon = document.getElementById("playicon");
    var seekback = document.getElementById("seekback");
    var fullscreen = document.getElementById("fullscreen");
    var testyfull = document.getElementById("testyfull");
    var fullicon = document.getElementById("fullicon");
    var controls = document.getElementById("controls");
    var seekthumb = document.getElementById("seekthumbnail");
    var seekthumbimage = <HTMLVideoElement>(document.getElementById("seekthumbnailimage"));
    var seekthumbtime = document.getElementById("seekthumbnailtime");
    var vidmainiconplay = document.getElementById("vidmainiconplay");
    var vidmainiconplayicon = document.getElementById("vidmainiconplayicon");
    var vidmainiconbuffer = document.getElementById("vidmainiconbuffer");

    seekthumbimage.src = video.currentSrc;
    var seekbackpos = seekback.getBoundingClientRect().left;
    var time = 0;
    var once = true;
    var fullscr = false;
    var mousedown = false;

    var speedsmap = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
    var speeds = document.querySelectorAll("#playbackspeed li");
    for (var i = 0; i < speeds.length; i++) {
        speeds[i].addEventListener("click", function () {
            for (var j = 0; j < speeds.length; j++) {
                if (speeds[j] != this) {
                    (<HTMLElement><any>speeds[j]).style.color = "darkorange";
                }
                else {
                    this.style.color = "#ffe8cc";
                    video.playbackRate = speedsmap[j];
                }
            }

        });
    }
    (<HTMLElement><any>speeds[3]).style.color = "#ffe8cc";

    var looptoggle = false;
    var loop = document.getElementById("playbackloop");
    loop.addEventListener("click", function () {
        looptoggle = !looptoggle;
        video.loop = looptoggle;
        if (looptoggle) {
            this.style.color = "#ffe8cc";
            this.style.backgroundColor = "#1c2f2f";
        }
        else {
            this.style.color = "darkorange";
            this.style.backgroundColor = "#172727";
        }
    });

    var settings = document.getElementById("settings");
    var settingsmenu = document.getElementById("settingsmenu");
    settingsmenu.style.visibility = "hidden";
    settings.style.transform = "rotate(12deg);";
    settings.style.webkitTransform = "rotate(12deg)";
    settings.addEventListener("click", function () {
        if (settingsmenu.style.visibility == "hidden") {
            this.style.transform = "rotate(0deg);";
            this.style.webkitTransform = "rotate(0deg)";
            settingsmenu.style.visibility = "visible";
        }
        else {
            settingsmenu.style.visibility = "hidden";
            this.style.transform = "rotate(12deg);";
            this.style.webkitTransform = "rotate(12deg)";
        }
    });

    settingsmenu.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    video.addEventListener("mousedown", function (e) {
        if (e.button === 0) {
            if (settingsmenu.style.visibility === "visible") {
                settingsmenu.style.visibility = "hidden";
                settings.style.transform = "rotate(12deg);";
                settings.style.webkitTransform = "rotate(12deg)";
            }
            if (video.paused) {
                //vidmainiconicon.className = "fa fa-pause";
                //vidmainicon.style.opacity = "0";
                video.play();
            }
            else {
                //vidmainiconicon.className = "fa fa-play";
                //vidmainicon.style.opacity = "1";
                video.pause();
            }
        }
    });

    video.addEventListener("waiting", function () {
        vidmainiconbuffer.style.webkitAnimationPlayState = "running";
        vidmainiconplay.style.opacity = "0";
        vidmainiconbuffer.style.opacity = "1";
    })

    video.addEventListener('ended', function () {
        playicon.className = "fa fa-play";
        vidmainiconbuffer.style.opacity = "0";
        vidmainiconplay.style.opacity = "1";
        vidmainiconbuffer.style.webkitAnimationPlayState = "paused";
    });

    video.addEventListener('playing', function () {
        playicon.className = "fa fa-pause";
        vidmainiconplay.style.opacity = "0";
        vidmainiconbuffer.style.opacity = "0";
        vidmainiconbuffer.style.webkitAnimationPlayState = "paused";
    });

    video.addEventListener('pause', function () {
        playicon.className = "fa fa-play";
        vidmainiconbuffer.style.opacity = "0";
        vidmainiconplay.style.opacity = "1";
        vidmainiconbuffer.style.webkitAnimationPlayState = "paused";
    });

    document.addEventListener("mousedown", function (e) {
        if (e.button === 0) {
            mousedown = true;
        }
    });

    document.addEventListener("mouseup", function (e) {
        mousedown = false;
    })

    document.addEventListener("mouseleave", function (e) {
        mousedown = false;
    })

    seekback.addEventListener("mousedown", function (e) {
        e.preventDefault();
        if (e.button === 0) {
            video.pause();
            if (fullscr) {
                video.currentTime = (e.clientX / screen.width) * video.duration;
            }
            else {
                video.currentTime = ((e.clientX - seekbackpos) / 1280) * video.duration;
            }
            document.addEventListener("mousemove", function mouseMove(e) {
                if (fullscr) {
                    time = (e.clientX / screen.width) * video.duration;
                }
                else {
                    time = ((e.clientX - seekbackpos) / 1280) * video.duration;
                }
                time = clamp(time, 0, video.duration);
                if (Math.abs(video.currentTime - time) > (video.duration * 0.02)) {
                    video.currentTime = time;
                }
                seek.style.width = ((time / video.duration) * 100) + "%";
                thumbMove(e);
                if (once) {
                    once = false;
                    document.addEventListener("mouseup", function mouseUp(e) {
                        once = true;
                        document.removeEventListener("mousemove", mouseMove);
                        document.removeEventListener("mouseup", mouseUp);
                        video.currentTime = time;
                        video.play();
                        seekthumb.style.opacity = "0";
                    });
                    document.addEventListener("mouseleave", function mouseExit(e) {
                        document.removeEventListener("mousemove", mouseMove);
                        document.removeEventListener("mouseleave", mouseExit);
                        video.currentTime = time;
                        video.play();
                        seekthumb.style.opacity = "0";
                    });
                }
            });
        }
    });

    seekback.addEventListener("mousemove", () => thumbMove(event as MouseEvent));/*function (e) {
        this.onmousemove = function (e) {
            var amt = 0;
            if (fullscr) {
                amt = (e.clientX / screen.width) * 100;
                seekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
                seekthumbimage.currentTime = amt / 100 * video.duration;
                var test = (128 / screen.width) * 100;
                amt = clamp(amt, test, 100 - test);
                amt -= test;
            }
            else {
                amt = ((e.clientX - this.getBoundingClientRect().left) / 1280) * 100;
                if (amt < 0) amt = 0;
                seekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
                seekthumbimage.currentTime = amt / 100 * video.duration;
                var test = 128 / 1280 * 100;
                amt = clamp(amt, test, 100 - test);
                amt -= test;
            }
            seekthumb.style.left = amt + "%";
            seekthumb.style.opacity = 1 + "";
        }
    });*/

    function thumbMove(e: MouseEvent) {
        var amt = 0;
        if (fullscr) {
            amt = (e.clientX / screen.width) * 100;
            seekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
            seekthumbimage.currentTime = amt / 100 * video.duration;
            var test = (128 / screen.width) * 100;
            amt = clamp(amt, test, 100 - test);
            amt -= test;
        }
        else {
            amt = ((e.clientX - seekbackpos) / 1280) * 100;
            if (amt < 0) amt = 0;
            seekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
            seekthumbimage.currentTime = amt / 100 * video.duration;
            var test = 128 / 1280 * 100;
            amt = clamp(amt, test, 100 - test);
            amt -= test;
        }
        seekthumb.style.left = amt + "%";
        seekthumb.style.opacity = "1";
    }

    seekback.addEventListener("mouseout", function (e) {
        seekthumb.style.opacity = "0";
    })

    play.addEventListener("click", function () {
        if (video.paused) {
            video.play();
        }
        else {
            video.pause();
        }
    });

    currenttime.innerHTML = formatTime(video.currentTime) + "";
    video.addEventListener('timeupdate', function () {
        currenttime.innerHTML = formatTime(video.currentTime) + "";
        seek.style.width = ((video.currentTime / video.duration) * 100) + "%";
    });

    video.addEventListener('durationchange', function () {
        endtime.innerHTML = formatTime(video.duration) + "";
    });
    endtime.innerHTML = formatTime(video.duration) + "";

    vol.addEventListener("mousedown", function () {
        video.muted = !video.muted;
    });

    volbarback.addEventListener("mousedown", function (e) {
        var posx = 0;

        posx = clamp(e.clientX - this.getBoundingClientRect().left, 0, 100);
        video.volume = posx / 100;

        this.onmousemove = function (e) {
            posx = clamp(e.clientX - this.getBoundingClientRect().left, 0, 100);
            if (mousedown) video.volume = posx / 100;
        }
    });

    video.addEventListener('volumechange', function () {
        volbar.style.width = 100 * video.volume + "%";
        /*if(this.volume > 0.7){
            volicon.innerHTML = "volume_up";
        }else if(this.volume > 0.3){
            volicon.innerHTML = "volume_down";
        }else if(this.volume > 0){
            volicon.innerHTML = "volume_mute";
        }else{
            volicon.innerHTML = "volume_off";
        }*/
        if (video.muted) {
            volicon.innerHTML = "volume_off";
        } else {
            if (this.volume > 0.5) {
                volicon.innerHTML = "volume_up";
            } else if (this.volume > 0) {
                volicon.innerHTML = "volume_down";
            } else {
                volicon.innerHTML = "volume_mute";
            }
        }
    });
    volbar.style.width = 100 * video.volume + "%";

    fullscreen.addEventListener("click", function () {
        // are we full-screen?
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
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
            fullscr = false;
        }
        else {
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
            fullscr = true;
        }
    })
}
