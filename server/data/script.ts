interface Navigator {
    webkitGetGamepads?: () => Gamepad[];
}

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
    var seekback = document.getElementById("seekback") as HTMLCanvasElement;
    var canvaswrap = document.getElementById("canvaswrap");
    var ctx = seekback.getContext("2d");
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
    var loop = document.getElementById("playbackloop");
    var settings = document.getElementById("settings");
    var settingsmenu = document.getElementById("settingsmenu");

    var time = 0;
    var once = true;
    var fullscr = false;
    var mousedown = false;
    var playstate = false;
    var vidFocused = false;
    var looptoggle = false;
    var playPauseTimeout: NodeJS.Timer = null;
    var mouseMoveCheck: NodeJS.Timer = null;

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

    var searchbuttons = document.querySelectorAll(".searchModule>li");
    for (var i = 0; i < searchbuttons.length; i++) {
        (function () {
            var modal = searchbuttons[i].firstElementChild as HTMLElement;
            searchbuttons[i].addEventListener("click", function (e) {
                modal.style.display = "block";
            });
            document.addEventListener("click", function () {
                modal.style.display = "none";
            });
        }());
    }
    var parent = searchbuttons[0].parentElement.parentElement;
    parent.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    var date = 0;
    var dates = document.querySelectorAll("#searchModuleDates>li");
    setupRadio(dates, date, 0);

    var orderType = 0;
    var orderTypes = document.querySelectorAll("#searchModuleOrders>li");
    setupRadio(orderTypes, orderType, 0);

    function setupRadio(array: NodeListOf<Element>, selector: number, defaultNum: number) {
        for (var i = 0; i < array.length; i++) {
            if (i == defaultNum) {
                (<HTMLElement><any>array[i]).style.color = "#1c2f2f";;
                (<HTMLElement><any>array[i]).style.backgroundColor = "darkorange";
                selector = defaultNum;
            }
            array[i].addEventListener("click", function () {
                for (var j = 0; j < array.length; j++) {
                    if (this == array[j]) {
                        (<HTMLElement><any>array[j]).style.color = "#1c2f2f";;
                        (<HTMLElement><any>array[j]).style.backgroundColor = "darkorange";
                        selector = j;
                    } else {
                        (<HTMLElement><any>array[j]).style.color = "";
                        (<HTMLElement><any>array[j]).style.backgroundColor = "";
                    }
                }
            });
        }
    }

    var countries = document.querySelectorAll("#searchModuleCountries>li");
    var countriesOut: string[] = [];

    //will be filled via server requests
    var competitions = document.querySelectorAll("#searchModuleCompetitions>li");
    var competitionsOut: string[] = [];

    var teams = document.querySelectorAll("#searchModuleTeams>li");
    var teamsOut: string[] = [];

    var players = document.querySelectorAll("#searchModulePlayers>li");
    var playersOut: string[] = [];

    var searchTags = document.getElementById("searchModuleTags");
    var searchTagsUL = searchTags.firstChild as HTMLElement;

    setupCheckbox(countries, countriesOut, "country");
    setupCheckbox(competitions, competitionsOut, "competition");
    setupCheckbox(teams, teamsOut, "team");
    setupCheckbox(players, playersOut, "player");

    function setupCheckbox(array: NodeListOf<Element>, output: string[], type: string) {
        for (var i = 0; i < array.length; i++) {
            array[i].id = "checkbox: " + type + " " + array[i].innerHTML;
            array[i].addEventListener("click", function () {
                var ind = output.indexOf(this.innerHTML);
                if (ind == -1) {
                    this.style.color = "#1c2f2f";
                    this.style.backgroundColor = "darkorange";
                    output.push(this.innerHTML);
                    makeTag(this.innerHTML, type, searchTagsUL, true);
                } else {
                    this.style.color = "";
                    this.style.backgroundColor = "";
                    output.splice(ind, 1);
                    removeTag("tag: " + type + " " + this.innerHTML);
                }
                console.log(output);
            });
        }
    }

    function checkboxRemove(output: string[], elem: HTMLElement) {
        var ind = output.indexOf(elem.innerHTML);
        if (ind == -1) {
            elem.style.color = "#1c2f2f";
            elem.style.backgroundColor = "darkorange";
            output.push(this.innerHTML);
        } else {
            elem.style.color = "";;
            elem.style.backgroundColor = "";
            output.splice(ind, 1);
        }
    }

    function makeTag(contents: string, type: string, parent: HTMLElement, asButton: boolean) {
        var classID = "";
        switch (type) {
            case "country":
                classID = "tag-country";
                break;
            case "competition":
                classID = "tag-comp";
                break;
            case "team":
                classID = "tag-team";
                break;
            case "player":
                classID = "tag-player";
                break;
            case "source":
                classID = "tag-source";
                break;
            case "media":
                classID = "tag-media";
                break;
            default:
                throw TypeError("TYPE DOESN'T EXIST");
        }
        var tag = document.createElement("li") as HTMLElement;
        tag.innerHTML = contents;
        tag.className = classID;
        tag.id = "tag: " + type + " " + contents;
        if (asButton) {
            tag = wireTag(tag, parent, type);
        }
        parent.appendChild(tag)
    }

    function wireTag(tag: HTMLElement, parent: HTMLElement, type: string) {
        tag.addEventListener("click", function () {
            parent.removeChild(this);
            var checkbox = document.getElementById("checkbox: " + type + " " + this.innerHTML);
            switch (type) {
                case "country":
                    checkboxRemove(countriesOut, checkbox);
                    break;
                case "competition":
                    break;
                case "team":
                    break;
                case "player":
                    break;
                case "source":
                    break;
                case "media":
                    break;
                default:
                    throw TypeError("TYPE DOESN'T EXIST");
            }
        });
        return tag;
    }

    function removeTag(contents: string) {
        var tag = document.getElementById(contents);
        tag.parentNode.removeChild(tag);
    }

    loop.addEventListener("click", loopToggle);

    function loopToggle() {
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
    }

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

    seekback.height = 6;
    seekback.width = 1280;
    ctx.fillStyle = "#1c2f2f";
    ctx.fillRect(0, 0, seekback.width, seekback.height);
    ctx.fillStyle = "#6d8383";

    function drawBuffers() {
        ctx.fillStyle = "#1c2f2f";
        ctx.fillRect(0, 0, seekback.width, seekback.height);
        ctx.fillStyle = "#6d8383";
        for (i = 0; i < video.buffered.length; i++) {
            var inc = seekback.width / video.duration;
            var startX = video.buffered.start(i) * inc;
            var endX = video.buffered.end(i) * inc;
            var width = endX - startX;
            ctx.fillRect(startX, 0, width, seekback.height);
        }
    }
    video.addEventListener('playing', function () {
        playicon.className = "fa fa-pause";
        vidmainiconplay.style.opacity = "0";
        vidmainiconbuffer.style.opacity = "0";
        vidmainiconbuffer.style.webkitAnimationPlayState = "paused";
        drawBuffers();
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

    function seekMe(e: MouseEvent) {
        if (fullscr) {
            time = (e.clientX / screen.width) * video.duration;
        }
        else {
            time = ((e.clientX - canvaswrap.getBoundingClientRect().left) / video.width) * video.duration;
        }
        time = clamp(time, 0, video.duration);
        if (e.type == "mousedown") {
            video.currentTime = time;
        } else {
            if (Math.abs(video.currentTime - time) > (video.duration * 0.02)) {
                video.currentTime = time;
            }
            thumbMove(e);
        }
        seek.style.width = ((time / video.duration) * 100) + "%";
    }

    function stopSeek() {
        document.removeEventListener("mousemove", seekMe);
        document.removeEventListener("mouseup", stopSeek);
        document.removeEventListener("mouseleave", stopSeek);
        video.currentTime = time;
        if (playstate) video.play();
        seekthumb.style.opacity = "0";
    }

    canvaswrap.addEventListener("mousedown", function (e) {
        e.preventDefault();
        if (e.button === 0) {
            video.pause();
            seekMe(e);
            document.addEventListener("mousemove", seekMe);
            document.addEventListener("mouseup", stopSeek);
            document.addEventListener("mouseleave", stopSeek);
        }
    });

    canvaswrap.addEventListener("mousemove", thumbMove);

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
            amt = ((e.clientX - canvaswrap.getBoundingClientRect().left) / 1280) * 100;
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
        seekback.height = 26;
        drawBuffers();
    }

    canvaswrap.addEventListener("mouseout", function (e) {
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
            seekback.width = screen.width;
        }
        else {
            clearTimeout(mouseMoveCheck);
            fullscr = false;
            fullicon.innerHTML = "fullscreen";
            video.style.cursor = "default";
            controls.style.opacity = "";
            seekback.width = 1280;
        }
        drawBuffers();
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

    // CONTROLLER stuff

    var haveEvents = 'ongamepadconnected' in window;
    var controllers: { [Index: number]: Gamepad } = {};
    var buttonTimouts: { [index: number]: NodeJS.Timer } = new Array(16);
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

        for (var j in controllers) {
            var controller = controllers[j];
            for (var i = 0; i < controller.buttons.length; i++) {
                var button: GamepadButton = controller.buttons[i];
                var pressed: boolean = false;
                var triggerAmount = 0;
                if (typeof (button) == "object") {
                    pressed = button.pressed;
                    triggerAmount = button.value;
                } else {
                    pressed = (button == 1.0);
                }
                var isTrigger = (i == 6 || i == 7);
                var triggerPressed = triggerAmount == 1;

                if (!isTrigger && pressed || triggerPressed) {
                    if (buttonTimouts[i] == undefined) {
                        var selectedButton = i;
                        buttonTimouts[selectedButton] = setTimeout(() => {
                            clearTimeout(buttonTimouts[selectedButton]);
                            buttonTimouts[selectedButton] = undefined;
                        }, 350);
                    }
                    else {
                        pressed = false;
                    }
                }

                if (pressed) {
                    switch (i) {
                        // A BUTTON
                        case 0:
                            console.log("a");
                            if (vidFocused) {
                                togglePlayPause();
                            } else {
                                //
                            }
                            break;
                        // B BUTTON
                        case 1:
                            if (vidFocused) {
                                vidFocused = false;
                            } else {
                                //
                            }
                            break;
                        // X BUTTON
                        case 2:
                            if (vidFocused) {
                                //goFullscreen();
                            } else {
                                //
                            }
                            break;
                        // Y BUTTON
                        case 3:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // LB
                        case 4:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // RB
                        case 5:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // LT
                        case 6:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // RT
                        case 7:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // SELECT
                        case 8:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // START
                        case 9:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // LEFT STICK
                        case 10:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // RIGHT STICK
                        case 11:
                            if (vidFocused) {
                                //
                            } else {
                                //
                            }
                            break;
                        // UP BUTTON
                        case 12:
                            if (vidFocused) {
                                video.volume = clamp(video.volume + 0.05, 0, 1);
                            } else {
                                //
                            }
                            break;
                        // DOWN BUTTON
                        case 13:
                            if (vidFocused) {
                                video.volume = clamp(video.volume - 0.05, 0, 1);
                            } else {
                                //
                            }
                            break;
                        // LEFT BUTTON
                        case 14:
                            if (vidFocused) {
                                video.currentTime = clamp(video.currentTime - 4, 0, video.duration);
                            } else {
                                //
                            }
                            break;
                        // RIGHT BUTTON
                        case 15:
                            if (vidFocused) {
                                video.currentTime = clamp(video.currentTime + 4, 0, video.duration);
                            } else {
                                //
                            }
                            break;
                        default:
                            break;
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
                    if (axisamount != 0) video.currentTime = clamp(video.currentTime + (0.04 * axisamount), 0, video.duration);
                }
                //leftstick y
                if (i == 1) {
                    if (axisamount != 0) video.volume = clamp(video.volume + (0.05 * axisamount), 0, 1);
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

    if (!haveEvents) {
        setInterval(scangamepads, 500);
    }
}
