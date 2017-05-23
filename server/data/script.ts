interface Navigator {
    webkitGetGamepads?: () => Gamepad[];
}

var haveEvents = 'ongamepadconnected' in window;
var controllers: { [Index: number]: Gamepad } = {};
//var buttons: { [Index: number]: GamepadButton} = {}
var currentbutton = 0;

function connecthandler(e: GamepadEvent) {
    addgamepad(e.gamepad);
}

function addgamepad(gamepad: Gamepad) {
    controllers[gamepad.index] = gamepad;
    requestAnimationFrame(updateStatus);
}

function disconnecthandler(e: GamepadEvent) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad: Gamepad) {
    delete controllers[gamepad.index];
}

function updateStatus() {
    if (!haveEvents) {
        scangamepads();
    }

    var i = 0;
    var j;

    for (j in controllers) {
        var controller = controllers[j];
        for (i = 0; i < controller.buttons.length; i++) {
            var button: GamepadButton = controller.buttons[i];
            var pressed: boolean = false;
            var triggerAmount = 0;
            if (typeof (button) == "object") {
                pressed = button.pressed;
                triggerAmount = button.value;
            } else {
                pressed = (button == 1.0) ? true : false;
            }

            //0=A
            if (i == 0) {
                if (pressed) {
                    console.log("a pressed");
                } else {
                }
            }
            //1=b
            else if (i == 1) {
                if (pressed) {
                } else {
                }
            }
            //2=x
            else if (i == 2) {
                if (pressed) {
                } else {
                }
            }
            //3=y
            else if (i == 3) {
                if (pressed) {
                } else {
                }
            }
            //4=lb
            else if (i == 4) {
                if (pressed) {
                } else {
                }
            }
            //5=rb
            else if (i == 5) {
                if (pressed) {
                } else {
                }
            }
            //6=lt
            else if (i == 6) {
                if (pressed) {
                    //var am = val * 400 + "px";
                    console.log("lt pressed: " + triggerAmount)
                } else {
                }
            }
            //7=rt
            else if (i == 7) {
                if (pressed) {
                    //var am = val * 400 + "px";
                } else {
                }
            }
            //8=select
            else if (i == 8) {
                if (pressed) {
                } else {
                }
            }
            //9=start
            else if (i == 9) {
                if (pressed) {
                } else {
                }
            }
            //10=left stick
            else if (i == 10) {
                if (pressed) {
                } else {
                }
            }
            //11=rightstick
            else if (i == 11) {
                if (pressed) {
                } else {
                }
            }
            //12=up
            else if (i == 12) {
                if (pressed) {
                } else {
                }
            }
            //13=down
            else if (i == 13) {
                if (pressed) {
                } else {
                }
            }
            //14=left
            else if (i == 14) {
                if (pressed) {
                } else {
                }
            }
            //15=right
            else if (i == 15) {
                if (pressed) {
                } else {
                }
            }
        }
        for (i = 0; i < controller.axes.length; i++) {
            var dead = 0.2;
            var axisamount;
            axisamount = controller.axes[i];
            //dead zone stuff
            if (axisamount >= 1 - dead) axisamount = 1;
            if (axisamount <= -1 + dead) axisamount = -1;
            if (axisamount <= dead && axisamount >= 0) axisamount = 0;
            if (axisamount >= -dead && axisamount <= 0) axisamount = 0;
            //leftstick x
            if (i == 0) {
            }
            //leftstick y
            if (i == 1) {
            }
            //rightstick x
            if (i == 2) {
            }
            //rightstick y
            if (i == 3) {
            }
        }
    }

    requestAnimationFrame(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (gamepads[i].index in controllers) {
                controllers[gamepads[i].index] = gamepads[i];
            } else {
                addgamepad(gamepads[i]);
            }
        }
    }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);
/*window.addEventListener("mousedown", function (e) {
    console.log(navigator.getGamepads()[0].id);
    document.getElementById("gamepads-connected").innerHTML = navigator.getGamepads()[0].id;
    buttons = document.getElementById('testbuttons').children;
    buttons[currentbutton].focus();
})*/

if (!haveEvents) {
    setInterval(scangamepads, 500);
}

/*window.onload = function () {
    console.log(navigator.getGamepads()[0].id);
    document.getElementById("gamepads-connected").innerHTML = navigator.getGamepads()[0].id;
    buttons = document.getElementById('testbuttons').children;
    buttons[currentbutton].focus();
}*/

interface Document {
    msExitFullscreen?: () => void;
    msFullscreenElement?: Element;
    mozCancelFullScreen?: () => void;
    mozFullScreenElement?: Element;
}

interface Element {
    msRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
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
    var seekthumbarrow = document.getElementById("seekthumbarrow");
    var vidmainiconplay = document.getElementById("vidmainiconplay");
    var vidmainiconplayicon = document.getElementById("vidmainiconplayicon");
    var vidmainiconbuffer = document.getElementById("vidmainiconbuffer");

    var time = 0;
    var once = true;
    var fullscr = false;
    var mousedown = false;
    var playstate = false;
    var vidFocused = false;

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

    var playPauseTimeout: NodeJS.Timer = null;

    video.addEventListener("click", function onVideoClick(e) {
        if (playPauseTimeout === null) {
            playPauseTimeout = setTimeout(() => {
                if (e.button === 0) {
                    togglePlayPause();
                }
                playPauseTimeout = null;
            }, 50);
        }
        else {
            playPauseTimeout = null;
            clearTimeout(playPauseTimeout);
        }
    });

    var mouseMoveCheck: NodeJS.Timer = null;

    video.addEventListener('mousemove', function onVideoMouseMove() {
        if (fullscr) {
            if (mouseMoveCheck !== null) {
                clearTimeout(mouseMoveCheck);
            }
            video.style.cursor = "default";
            controls.style.opacity = "0.8";
            mouseMoveCheck = setTimeout(() => {
                video.style.cursor = "none";
                controls.style.opacity = "0";
                seekthumb.style.opacity = "0";
            }, 2000);
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

    video.addEventListener('dblclick', goFullscreen);

    document.addEventListener("mousedown", function (e) {
        if (e.button === 0) {
            mousedown = true;
            //console.log(isChildOfVideo(e.target as HTMLElement));
            if (isChildOfVideo(e.target as HTMLElement)) {
                vidFocused = true;
            }
            else {
                vidFocused = false;
            }
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
                video.currentTime = ((e.clientX - seekback.getBoundingClientRect().left) / 1280) * video.duration;
            }
            document.addEventListener("mousemove", function mouseMove(e) {
                if (fullscr) {
                    time = (e.clientX / screen.width) * video.duration;
                }
                else {
                    time = ((e.clientX - seekback.getBoundingClientRect().left) / 1280) * video.duration;
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
                        if (playstate) video.play();
                        seekthumb.style.opacity = "0";
                    });
                    document.addEventListener("mouseleave", function mouseExit(e) {
                        document.removeEventListener("mousemove", mouseMove);
                        document.removeEventListener("mouseleave", mouseExit);
                        video.currentTime = time;
                        if (playstate) video.play();
                        seekthumb.style.opacity = "0";
                    });
                }
            });
        }
    });

    seekback.addEventListener("mousemove", () => thumbMove(event as MouseEvent));

    function thumbMove(e: MouseEvent) {
        var amt = 0;
        var arrowoffset = 0;
        if (fullscr) {
            amt = (e.clientX / screen.width) * 100;
            seekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
            seekthumbimage.currentTime = amt / 100 * video.duration;
            var test = (128 / screen.width) * 100;
            if (amt < test) {
                arrowoffset = -((test - amt) * 50 / test);
                amt = test;
            }
            if (amt > 100 - test) {
                arrowoffset = (test - (100 - amt)) * 50 / test;
                amt = 100 - test;
            }
            //amt = clamp(amt, test, 100 - test);
            amt -= test;
        }
        else {
            amt = ((e.clientX - seekback.getBoundingClientRect().left) / 1280) * 100;
            if (amt < 0) amt = 0;
            seekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
            seekthumbimage.currentTime = amt / 100 * video.duration;
            var test = 128 / 1280 * 100;
            if (amt < test) {
                arrowoffset = -((test - amt) * 50 / test);
                amt = test;
            }
            if (amt > 100 - test) {
                arrowoffset = (test - (100 - amt)) * 50 / test;
                amt = 100 - test;
            }
            //amt = clamp(amt, test, 100 - test);
            amt -= test;
        }
        seekthumb.style.left = amt + "%";
        seekthumb.style.opacity = "1";
        seekthumbarrow.style.left = (50 + arrowoffset) + "%";
    }

    seekback.addEventListener("mouseout", function (e) {
        seekthumb.style.opacity = "0";
    })

    play.addEventListener("click", function () {
        togglePlayPause();
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

    fullscreen.addEventListener("click", goFullscreen);

    function goFullscreen() {
        // are we full-screen?
        if (fullscr) {
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
        }
    }

    document.addEventListener("webkitfullscreenchange", FullscreenEvent);

    document.addEventListener("mozfullscreenchange", FullscreenEvent);

    document.addEventListener("fullscreenchange", FullscreenEvent);

    document.addEventListener("MSFullscreenChange", FullscreenEvent);

    function FullscreenEvent() {
        // are we full-screen?
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            fullscr = true;
            fullicon.innerHTML = "fullscreen_exit";
        }
        else {
            clearTimeout(mouseMoveCheck);
            fullscr = false;
            fullicon.innerHTML = "fullscreen";
            video.style.cursor = "default";
            controls.style.opacity = "";
        }
    }

    //doc stuff to handle keypress events - the excape one is relevant to vids the others r not
    document.addEventListener('keydown', function (e) {
        if (vidFocused) {
            e.preventDefault();
            switch (e.keyCode) {
                //currently flat 4 secs shift - may make percentage or maybe make as an option
                //left arrow
                case 37:
                    video.currentTime = clamp(video.currentTime - 4, 0, video.duration);
                    break;
                //right arrow
                case 39:
                    video.currentTime = clamp(video.currentTime + 4, 0, video.duration);
                    break;
                //space
                case 32:
                    togglePlayPause();
                    break;
                //up arrow
                case 38:
                    video.volume = clamp(video.volume + 0.05, 0, 1);
                    break;
                //down arrow
                case 40:
                    video.volume = clamp(video.volume - 0.05, 0, 1);
                    break;
                //esc - to unfocus video
                case 27:
                    vidFocused = false;
                    break;
                //f button
                case 70:
                    goFullscreen();
                    break;
                default: break;
            }
        }
    });

    function togglePlayPause() {
        if (settingsmenu.style.visibility === "visible") {
            settingsmenu.style.visibility = "hidden";
            settings.style.transform = "rotate(12deg);";
            settings.style.webkitTransform = "rotate(12deg)";
        }
        if (video.paused) {
            video.play();
            playstate = true;
        }
        else {
            video.pause();
            playstate = false;
        }
    }

    function isChildOfVideo(target: HTMLElement): boolean {
        if (target.classList.contains("video-player-wrapper")) {
            return true;
        } else if (target.parentElement == null) {
            return false;
        } else {
            return isChildOfVideo(target.parentElement);
        }
    }
}
