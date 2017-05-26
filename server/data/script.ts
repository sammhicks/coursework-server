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

    var mousedown = false;
    var vidFocused = false;
    var fullscr = false;
    var mouseMoveCheck: NodeJS.Timer = null;

    //global video objects
    var globalVideo: HTMLVideoElement = null;
    var globalContainer: HTMLElement = null;
    var globalCanvas: HTMLCanvasElement = null;
    var globalFullscreenIcon: HTMLElement = null;
    var globalControls: HTMLElement = null;
    var globalCtx: CanvasRenderingContext2D = null;
    var globalPlaystate: boolean = null;
    var globalSettingsMenu: HTMLElement = null;
    var globalSettings: HTMLElement = null;

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
    var countriesOut: Set<any> = new Set();

    //will be filled via server requests
    var competitions = document.querySelectorAll("#searchModuleCompetitions>li");
    var competitionsOut: Set<any> = new Set();

    var teams = document.querySelectorAll("#searchModuleTeams>li");
    var teamsOut: Set<any> = new Set();

    var players = document.querySelectorAll("#searchModulePlayers>li");
    var playersOut: Set<any> = new Set();

    var searchTags = document.getElementById("searchModuleTags");
    var searchTagsCountry = searchTags.firstElementChild as HTMLElement;
    var searchTagsComp = searchTagsCountry.nextElementSibling as HTMLElement;
    var searchTagsTeam = searchTagsCountry.nextElementSibling as HTMLElement;
    var searchTagsPlayer = searchTagsCountry.nextElementSibling as HTMLElement;

    function setupCheckbox(elem: HTMLElement, output: Set<any>, type: string, obj: any) {
        elem.innerHTML = obj.name;
        elem.id = "checkbox: " + type + " " + obj.id;
        elem.addEventListener("click", function () {
            if (!output.has(obj)) {
                this.style.color = "#1c2f2f";
                this.style.backgroundColor = "darkorange";
                output.add(obj);
                switch (type) {
                    case "country":
                        makeTagButton(type, searchTagsCountry, obj);
                        var parent2 = document.getElementById("searchModuleCompetitions");
                        var call = "api/countries/" + Array.from(countriesOut).map(c => c.id).join("+") + "/competitions";
                        jQuery.getJSON(call, function onResult(compsJson) {
                            //remove stuff
                            while (parent2.firstElementChild) {
                                parent2.removeChild(parent2.firstElementChild);
                            }
                            //add stuff
                            for (var i = 0; i < compsJson.length; i++) {
                                var elem = document.createElement("li");
                                parent2.appendChild(elem);
                                setupCheckbox(elem, competitionsOut, "competition", compsJson[i]);
                            }
                        });
                        break;
                    case "competition":
                        makeTagButton(type, searchTagsComp, obj);
                        break;
                    case "team":
                        makeTagButton(type, searchTagsTeam, obj);
                        break;
                    case "player":
                        makeTagButton(type, searchTagsPlayer, obj);
                        break;
                    default:
                        break;
                }
            } else {
                this.style.color = "";
                this.style.backgroundColor = "";
                output.delete(obj);
                removeTag("tag: " + type + " " + obj.id);
                switch (type) {
                    case "country":
                        var parent2 = document.getElementById("searchModuleCompetitions");
                        var call = "api/countries/" + Array.from(countriesOut).map(c => c.id).join("+") + "/competitions";
                        jQuery.getJSON(call, function onResult(compsJson) {
                            //remove stuff
                            while (parent2.firstElementChild) {
                                parent2.removeChild(parent2.firstElementChild);
                            }
                            //add stuff
                            for (var i = 0; i < compsJson.length; i++) {
                                var elem = document.createElement("li");
                                parent2.appendChild(elem);
                                setupCheckbox(elem, competitionsOut, "competition", compsJson[i]);
                            }
                        });
                        break;
                    case "competition":
                        break;
                    case "team":
                        break;
                    case "player":
                        break;
                    default:
                        break;
                }
            }
        });
    }

    function checkboxRemove(output: Set<any>, elem: HTMLElement, obj: any) {
        if (!output.has(obj)) {
            elem.style.color = "#1c2f2f";
            elem.style.backgroundColor = "darkorange";
            output.add(obj)
        } else {
            elem.style.color = "";;
            elem.style.backgroundColor = "";
            output.delete(obj);
        }
    }

    function makeTag(contents: string, type: string, parent: HTMLElement) {
        if (contents.length < 1)
            return;
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
        parent.appendChild(tag)
    }

    function makeTagButton(type: string, parent: HTMLElement, obj: any) {
        if (obj.name.length < 1)
            return;
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
        tag.innerHTML = obj.name;
        tag.className = classID;
        tag.id = "tag: " + type + " " + obj.id;
        tag = wireTag(tag, parent, type, obj);
        parent.appendChild(tag)
    }

    function wireTag(tag: HTMLElement, parent: HTMLElement, type: string, obj: any) {
        tag.addEventListener("click", function () {
            parent.removeChild(this);
            var checkbox = document.getElementById("checkbox: " + type + " " + obj.id);
            switch (type) {
                case "country":
                    checkboxRemove(countriesOut, checkbox, obj);
                    break;
                case "competition":
                    checkboxRemove(competitionsOut, checkbox, obj);
                    break;
                case "team":
                    checkboxRemove(teamsOut, checkbox, obj);
                    break;
                case "player":
                    checkboxRemove(playersOut, checkbox, obj);
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

    var parent1 = document.getElementById("searchModuleCountries");
    jQuery.getJSON("/api/countries", function onResult(countriesJson) {
        //remove stuff
        while (parent1.firstElementChild) {
            parent1.removeChild(parent1.firstElementChild);
        }
        //add stuff
        for (var i = 0; i < countriesJson.length; i++) {
            var elem = document.createElement("li");
            parent1.appendChild(elem);
            setupCheckbox(elem, countriesOut, "country", countriesJson[i]);
        }
    });

    var parent2 = document.getElementById("searchModuleCompetitions");
    jQuery.getJSON("/api/competitions", function onResult(compsJson) {
        //remove stuff
        while (parent2.firstElementChild) {
            parent2.removeChild(parent2.firstElementChild);
        }
        //add stuff
        for (var i = 0; i < compsJson.length; i++) {
            var elem = document.createElement("li");
            parent2.appendChild(elem);
            setupCheckbox(elem, competitionsOut, "competition", compsJson[i]);
        }
    });

    var parent3 = document.getElementById("searchModuleTeams");
    jQuery.getJSON("/api/teams", function onResult(teamsJson) {
        //remove stuff
        while (parent3.firstElementChild) {
            parent3.removeChild(parent3.firstElementChild);
        }
        //add stuff
        for (var i = 0; i < teamsJson.length; i++) {
            var elem = document.createElement("li");
            parent3.appendChild(elem);
            setupCheckbox(elem, teamsOut, "team", teamsJson[i]);
        }
    });

    var searchbuttons = document.querySelectorAll(".searchModule>li");
    for (var i = 0; i < searchbuttons.length; i++) {
        (function () {
            var modal = searchbuttons[i].firstElementChild as HTMLElement;
            var savedi = i;
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

    //COMEBACKTO
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

    document.addEventListener("webkitfullscreenchange", FullscreenEvent);
    document.addEventListener("mozfullscreenchange", FullscreenEvent);
    document.addEventListener("fullscreenchange", FullscreenEvent);
    document.addEventListener("MSFullscreenChange", FullscreenEvent);

    function togglePlayPause() {
        if (globalSettingsMenu.style.visibility === "visible") {
            globalSettingsMenu.style.visibility = "hidden";
            globalSettings.style.transform = "rotate(12deg);";
            globalSettings.style.webkitTransform = "rotate(12deg)";
        }
        if (globalVideo.paused) {
            globalVideo.play();
            globalPlaystate = true;
        }
        else {
            globalVideo.pause();
            globalPlaystate = false;
        }
        return globalPlaystate;
    }

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
            if (globalContainer.requestFullscreen) {
                globalContainer.requestFullscreen();
            } else if (globalContainer.mozRequestFullScreen) {
                globalContainer.mozRequestFullScreen(); // Firefox
            } else if (globalContainer.webkitRequestFullscreen) {
                globalContainer.webkitRequestFullscreen(); // Chrome and Safari
            } else if (globalContainer.msRequestFullscreen) {
                globalContainer.msRequestFullscreen();
            }
        }
    }

    function FullscreenEvent() {
        // are we full-screen?
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            fullscr = true;
            globalFullscreenIcon.innerHTML = "fullscreen_exit";
            globalCanvas.width = screen.width;
        }
        else {
            clearTimeout(mouseMoveCheck);
            fullscr = false;
            globalFullscreenIcon.innerHTML = "fullscreen";
            globalVideo.style.cursor = "default";
            globalControls.style.opacity = "";
            globalCanvas.width = 1280;
        }
        drawBuffers();
    }

    function drawBuffers() {
        globalCtx.fillStyle = "#1c2f2f";
        globalCtx.fillRect(0, 0, globalCanvas.width, globalCanvas.height);
        globalCtx.fillStyle = "#6d8383";
        for (i = 0; i < globalVideo.buffered.length; i++) {
            var inc = globalCanvas.width / globalVideo.duration;
            var startX = globalVideo.buffered.start(i) * inc;
            var endX = globalVideo.buffered.end(i) * inc;
            var width = endX - startX;
            globalCtx.fillRect(startX, 0, width, globalCanvas.height);
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
                    globalVideo.currentTime = clamp(globalVideo.currentTime - 4, 0, globalVideo.duration);
                    break;
                //right arrow
                case 39:
                    globalVideo.currentTime = clamp(globalVideo.currentTime + 4, 0, globalVideo.duration);
                    break;
                //space
                case 32:
                    togglePlayPause();
                    break;
                //up arrow
                case 38:
                    globalVideo.volume = clamp(globalVideo.volume + 0.05, 0, 1);
                    break;
                //down arrow
                case 40:
                    globalVideo.volume = clamp(globalVideo.volume - 0.05, 0, 1);
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

    function isChildOfVideo(target: HTMLElement): boolean {
        if (target.classList.contains("video-player-wrapper")) {
            return true;
        } else if (target.parentElement == null) {
            return false;
        } else {
            return isChildOfVideo(target.parentElement);
        }
    }

    var testyplease = createVideoEnvironment("https://u.nya.is/oobaxw.mp4", ["test title", "12-12-2012", "england", "prem", "chelsea", "hazard", "streamable"]);
    var home = document.getElementById("homepageContent").appendChild(testyplease);

    var vid1 = createVideoEnvironment("https://cdn-e2.streamable.com/video/mp4/m445e_1.mp4?token=1496778426_07e366ba0b3fa0a794e9c2dd6bbb4b49a7178485",
        ["SECOND VID", "01-12-2016", "Spain", "la liga", "real madrid", "ronaldo", "streamable"]);
    var vid2 = createVideoEnvironment("https://cdn-e2.streamable.com/video/mp4/cahge.mp4?token=1496778368_80dfcb565d05f3cee83cbf98d8107497a14085a7",
        ["third vid", "12-12-1972", "France", "ligue 1", "monaco", "", "streamable"]);
    var vid3 = createVideoEnvironment("https://cdn-e2.streamable.com/video/mp4/z2bnh.mp4?token=1496778133_f95644a1a6f3dd47dfb804c181a94efe3053950f",
        ["4th", "12-12-2069", "england", "championship", "", "", "streamable"]);

    home.appendChild(vid1);
    home.appendChild(vid2);
    home.appendChild(vid3);

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
                                globalVideo.volume = clamp(globalVideo.volume + 0.05, 0, 1);
                            } else {
                                //
                            }
                            break;
                        // DOWN BUTTON
                        case 13:
                            if (vidFocused) {
                                globalVideo.volume = clamp(globalVideo.volume - 0.05, 0, 1);
                            } else {
                                //
                            }
                            break;
                        // LEFT BUTTON
                        case 14:
                            if (vidFocused) {
                                globalVideo.currentTime = clamp(globalVideo.currentTime - 4, 0, globalVideo.duration);
                            } else {
                                //
                            }
                            break;
                        // RIGHT BUTTON
                        case 15:
                            if (vidFocused) {
                                globalVideo.currentTime = clamp(globalVideo.currentTime + 4, 0, globalVideo.duration);
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
                    if (axisamount != 0) globalVideo.currentTime = clamp(globalVideo.currentTime + (0.04 * axisamount), 0, globalVideo.duration);
                }
                //leftstick y
                if (i == 1) {
                    if (axisamount != 0) globalVideo.volume = clamp(globalVideo.volume + (0.05 * axisamount), 0, 1);
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


    function div() {
        return document.createElement("div");
    }

    function span() {
        return document.createElement("span");
    }

    function ul() {
        return document.createElement("ul");
    }

    function li() {
        return document.createElement("li");
    }

    function ii() {
        return document.createElement("i");
    }

    //video generation
    //meta stuff
    //0 = title
    //1 = date
    //2 = countries - blank if none
    //3 = comps - blank if none
    //4 = teams - blank if none
    //5 = players - blank if none
    //6 = source
    function createVideoEnvironment(url: string, meta: string[]) {
        var vidwrap = div();
        vidwrap.className = "video-wrapper";

        var vidinfowrap = div();
        vidinfowrap.className = "video-info-wrapper";
        vidwrap.appendChild(vidinfowrap);

        var vidtitle = span();
        vidtitle.className = "video-title";
        vidtitle.innerHTML = meta[0];
        vidinfowrap.appendChild(vidtitle);

        var viddate = span();
        viddate.className = "video-date";
        viddate.innerHTML = meta[1];
        vidinfowrap.appendChild(viddate);

        var vidtags = span();
        vidtags.className = "video-tags";
        vidtags.innerHTML = "Tags";
        vidinfowrap.appendChild(vidtags);

        var vidtagsul = ul();
        vidtags.appendChild(vidtagsul);

        var metatagscountry = meta[2].split("-");
        for (var i = 0; i < metatagscountry.length; i++) {
            makeTag(metatagscountry[i], "country", vidtagsul);
        }

        var metatagscomp = meta[3].split("-");
        for (var i = 0; i < metatagscomp.length; i++) {
            makeTag(metatagscomp[i], "competition", vidtagsul);
        }

        var metatagsteam = meta[4].split("-");
        for (var i = 0; i < metatagsteam.length; i++) {
            makeTag(metatagsteam[i], "team", vidtagsul);
        }

        var metatagsplayer = meta[5].split("-");
        for (var i = 0; i < metatagsplayer.length; i++) {
            makeTag(metatagsplayer[i], "player", vidtagsul);
        }

        makeTag("VIDEO", "media", vidtagsul);

        makeTag(meta[6], "source", vidtagsul);

        var vidplayerwrap = div();
        vidplayerwrap.className = "video-player-wrapper";
        vidplayerwrap.tabIndex = 0;
        vidwrap.appendChild(vidplayerwrap);

        var vidplayerwrapdiv = div();
        vidplayerwrap.appendChild(vidplayerwrapdiv);

        var vidcontainer = div();
        vidcontainer.className = "video-container";
        vidplayerwrapdiv.appendChild(vidcontainer);

        var video = document.createElement("video");
        video.src = url;
        video.width = 1280;
        video.height = 720;
        video.innerHTML = "Your browser does not support the video tag.";
        vidcontainer.appendChild(video);

        var vidmainiconplay = div();
        vidmainiconplay.className = "video-main-icon-play";
        vidcontainer.appendChild(vidmainiconplay);

        var vidmainiconplayi = ii();
        vidmainiconplayi.className = "fa fa-play";
        vidmainiconplay.appendChild(vidmainiconplayi);

        var vidmainiconbuffer = div();
        vidmainiconbuffer.className = "video-main-icon-buffer";
        vidcontainer.appendChild(vidmainiconbuffer);

        var vidmainiconbufferi = ii();
        vidmainiconbufferi.className = "fa fa-spinner";
        vidmainiconbuffer.appendChild(vidmainiconbufferi);

        var vidseekthumb = div();
        vidseekthumb.className = "video-seek-thumbnail";
        vidcontainer.appendChild(vidseekthumb);

        var vidseekthumbvideo = document.createElement("video");
        vidseekthumbvideo.className = "video-seek-thumbnail-image";
        vidseekthumbvideo.src = url;
        vidseekthumbvideo.innerHTML = "Your browser does not support the video tag.";
        vidseekthumb.appendChild(vidseekthumbvideo);

        var vidseekthumbtime = span();
        vidseekthumbtime.className = "video-seek-thumbnail-time";
        vidseekthumbtime.innerHTML = "00:00";
        vidseekthumb.appendChild(vidseekthumbtime);

        var vidseekthumbarrow = div();
        vidseekthumbarrow.className = "video-seek-thumbnail-arrow";
        vidseekthumb.appendChild(vidseekthumbarrow);

        var vidcontrols = div();
        vidcontrols.className = "video-controls";
        vidcontainer.appendChild(vidcontrols);

        var vidcontrolsseekwrapper = div();
        vidcontrolsseekwrapper.className = "canvas-wrapper";
        vidcontrols.appendChild(vidcontrolsseekwrapper);

        var vidcontrolsseekcanvas = document.createElement("canvas");
        vidcontrolsseekcanvas.className = "video-controls-seek";
        vidcontrolsseekwrapper.appendChild(vidcontrolsseekcanvas);

        var vidcontrolsseek = div();
        vidcontrolsseekwrapper.appendChild(vidcontrolsseek);

        var vidcontrolsplaypause = div();
        vidcontrolsplaypause.className = "video-controls-play-pause";
        vidcontrols.appendChild(vidcontrolsplaypause);

        var vidcontrolsplaypausei = ii();
        vidcontrolsplaypausei.className = "fa fa-play";
        vidcontrolsplaypause.appendChild(vidcontrolsplaypausei);

        var vidcontrolstime = div();
        vidcontrolstime.className = "video-controls-time";
        vidcontrols.appendChild(vidcontrolstime);

        var vidcontrolscurrenttime = div();
        vidcontrolscurrenttime.innerHTML = "00:00";
        vidcontrolstime.appendChild(vidcontrolscurrenttime);

        var vidcontrolsslash = div();
        vidcontrolsslash.innerHTML = "/";
        vidcontrolstime.appendChild(vidcontrolsslash);

        var vidcontrolsendtime = div();
        vidcontrolsendtime.innerHTML = "69:69";
        vidcontrolstime.appendChild(vidcontrolsendtime);

        var vidcontrolsvolume = div();
        vidcontrolsvolume.className = "video-controls-volume";
        vidcontrols.appendChild(vidcontrolsvolume);

        var vidcontrolsvolumei = ii();
        vidcontrolsvolumei.className = "material-icons md-48";
        vidcontrolsvolumei.innerHTML = "volume_up";
        vidcontrolsvolume.appendChild(vidcontrolsvolumei);

        var vidcontrolsvolumecontent = div();
        vidcontrolsvolumecontent.className = "video-controls-volume-content";
        vidcontrols.appendChild(vidcontrolsvolumecontent);

        var vidcontrolsvolumecontentbackground = div();
        vidcontrolsvolumecontent.appendChild(vidcontrolsvolumecontentbackground);

        var vidcontrolsvolumecontentbar = div();
        vidcontrolsvolumecontentbackground.appendChild(vidcontrolsvolumecontentbar);

        var vidcontrolsfullscreen = div();
        vidcontrolsfullscreen.className = "video-controls-fullscreen";
        vidcontrols.appendChild(vidcontrolsfullscreen);

        var vidcontrolsfullscreeni = ii();
        vidcontrolsfullscreeni.className = "material-icons md-48";
        vidcontrolsfullscreeni.innerHTML = "fullscreen";
        vidcontrolsfullscreen.appendChild(vidcontrolsfullscreeni);

        var vidcontrolssettings = div();
        vidcontrolssettings.className = "video-controls-settings";
        vidcontrols.appendChild(vidcontrolssettings);

        var vidcontrolssettingsi = ii();
        vidcontrolssettingsi.className = "fa fa-cog";
        vidcontrolssettings.appendChild(vidcontrolssettingsi);

        var vidcontrolssettingsmenu = div();
        vidcontrolssettingsmenu.className = "video-controls-settings-menu";
        vidcontrolssettings.appendChild(vidcontrolssettingsmenu);

        var vidcontrolssettingsmenuul = ul();
        vidcontrolssettingsmenu.appendChild(vidcontrolssettingsmenuul);

        var vidcontrolssettingsmenuli = li();
        vidcontrolssettingsmenuli.className = "video-controls-playback-speed"
        vidcontrolssettingsmenuli.innerHTML = "Speed";
        vidcontrolssettingsmenuul.appendChild(vidcontrolssettingsmenuli);

        var vidcontrolssettingsmenuliul = ul();
        vidcontrolssettingsmenuli.appendChild(vidcontrolssettingsmenuliul);

        var vidcontrolssettingsmenuliulli025 = li();
        vidcontrolssettingsmenuliulli025.innerHTML = "0.25x";
        vidcontrolssettingsmenuliul.appendChild(vidcontrolssettingsmenuliulli025);

        var vidcontrolssettingsmenuliulli05 = li();
        vidcontrolssettingsmenuliulli05.innerHTML = "0.5x";
        vidcontrolssettingsmenuliul.appendChild(vidcontrolssettingsmenuliulli05);

        var vidcontrolssettingsmenuliulli075 = li();
        vidcontrolssettingsmenuliulli075.innerHTML = "0.75x";
        vidcontrolssettingsmenuliul.appendChild(vidcontrolssettingsmenuliulli075);

        var vidcontrolssettingsmenuliulli1 = li();
        vidcontrolssettingsmenuliulli1.innerHTML = "Default";
        vidcontrolssettingsmenuliul.appendChild(vidcontrolssettingsmenuliulli1);

        var vidcontrolssettingsmenuliulli125 = li();
        vidcontrolssettingsmenuliulli125.innerHTML = "1.25x";
        vidcontrolssettingsmenuliul.appendChild(vidcontrolssettingsmenuliulli125);

        var vidcontrolssettingsmenuliulli15 = li();
        vidcontrolssettingsmenuliulli15.innerHTML = "1.5x";
        vidcontrolssettingsmenuliul.appendChild(vidcontrolssettingsmenuliulli15);

        var vidcontrolssettingsmenuliulli2 = li();
        vidcontrolssettingsmenuliulli2.innerHTML = "2x";
        vidcontrolssettingsmenuliul.appendChild(vidcontrolssettingsmenuliulli2);

        var vidcontrolssettingsmenuloop = li();
        vidcontrolssettingsmenuloop.innerHTML = "Loop";
        vidcontrolssettingsmenuul.appendChild(vidcontrolssettingsmenuloop);

        //wiring

        var time = 0;
        var playstate = false;
        var looptoggle = false;

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

        vidcontrolssettingsmenuloop.addEventListener("click", loopToggle);

        var speedsmap = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
        var speeds = [vidcontrolssettingsmenuliulli025, vidcontrolssettingsmenuliulli05, vidcontrolssettingsmenuliulli075, vidcontrolssettingsmenuliulli1,
            vidcontrolssettingsmenuliulli125, vidcontrolssettingsmenuliulli15, vidcontrolssettingsmenuliulli2];
        for (var i = 0; i < speeds.length; i++) {
            speeds[i].addEventListener("click", function () {
                for (var j = 0; j < speeds.length; j++) {
                    if (speeds[j] != this) {
                        speeds[j].style.color = "darkorange";
                    }
                    else {
                        this.style.color = "#ffe8cc";
                        video.playbackRate = speedsmap[j];
                    }
                }

            });
        }
        speeds[3].style.color = "#ffe8cc";

        vidcontrolssettingsmenu.style.visibility = "hidden";
        vidcontrolssettings.style.transform = "rotate(12deg);";
        vidcontrolssettings.style.webkitTransform = "rotate(12deg)";
        vidcontrolssettings.addEventListener("click", function () {
            if (vidcontrolssettingsmenu.style.visibility == "hidden") {
                this.style.transform = "rotate(0deg);";
                this.style.webkitTransform = "rotate(0deg)";
                vidcontrolssettingsmenu.style.visibility = "visible";
            }
            else {
                vidcontrolssettingsmenu.style.visibility = "hidden";
                this.style.transform = "rotate(12deg);";
                this.style.webkitTransform = "rotate(12deg)";
            }
        });

        vidcontrolssettingsmenu.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        video.addEventListener("click", function onVideoClick(e) {
            if (e.button === 0) {
                playstate = togglePlayPause();
            }
        });

        video.addEventListener('mousemove', function onVideoMouseMove() {
            if (fullscr) {
                if (mouseMoveCheck !== null) {
                    clearTimeout(mouseMoveCheck);
                }
                video.style.cursor = "default";
                vidcontrols.style.opacity = "0.8";
                mouseMoveCheck = setTimeout(() => {
                    video.style.cursor = "none";
                    vidcontrols.style.opacity = "0";
                    vidseekthumb.style.opacity = "0";
                }, 2000);
            }
        });

        video.addEventListener("waiting", function () {
            vidmainiconbuffer.style.webkitAnimationPlayState = "running";
            vidmainiconplay.style.opacity = "0";
            vidmainiconbuffer.style.opacity = "1";
        })

        video.addEventListener('ended', function () {
            vidcontrolsplaypausei.className = "fa fa-play";
            vidmainiconbuffer.style.opacity = "0";
            vidmainiconplay.style.opacity = "1";
            vidmainiconbuffer.style.webkitAnimationPlayState = "paused";
        });

        vidcontrolsseekcanvas.height = 6;
        vidcontrolsseekcanvas.width = 1280;
        var ctx = vidcontrolsseekcanvas.getContext("2d");
        //ctx.fillStyle = "6d8383";//"#1c2f2f";
        //ctx.fillRect(0, 0, vidcontrolsseekcanvas.width, vidcontrolsseekcanvas.height);
        vidcontrolsseekcanvas.style.backgroundColor = "#1c2f2f";
        ctx.fillStyle = "#6d8383";

        video.addEventListener('playing', function () {
            vidcontrolsplaypausei.className = "fa fa-pause";
            vidmainiconplay.style.opacity = "0";
            vidmainiconbuffer.style.opacity = "0";
            vidmainiconbuffer.style.webkitAnimationPlayState = "paused";
            drawBuffers();
        });

        video.addEventListener('pause', function () {
            vidcontrolsplaypausei.className = "fa fa-play";
            vidmainiconbuffer.style.opacity = "0";
            vidmainiconplay.style.opacity = "1";
            vidmainiconbuffer.style.webkitAnimationPlayState = "paused";
        });

        video.addEventListener('dblclick', goFullscreen);

        function seekMe(e: MouseEvent) {
            if (fullscr) {
                time = (e.clientX / screen.width) * video.duration;
            }
            else {
                time = ((e.clientX - vidcontrolsseekwrapper.getBoundingClientRect().left) / video.width) * video.duration;
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
            vidcontrolsseek.style.width = ((time / video.duration) * 100) + "%";
        }

        function stopSeek() {
            document.removeEventListener("mousemove", seekMe);
            document.removeEventListener("mouseup", stopSeek);
            document.removeEventListener("mouseleave", stopSeek);
            video.currentTime = time;
            if (playstate) video.play();
            vidseekthumb.style.opacity = "0";
        }

        vidcontrolsseekwrapper.addEventListener("mousedown", function (e) {
            e.preventDefault();
            if (e.button === 0) {
                video.pause();
                seekMe(e);
                document.addEventListener("mousemove", seekMe);
                document.addEventListener("mouseup", stopSeek);
                document.addEventListener("mouseleave", stopSeek);
            }
        });

        vidcontrolsseekwrapper.addEventListener("mousemove", thumbMove);

        function thumbMove(e: MouseEvent) {
            var amt = 0;
            var arrowoffset = 0;
            if (fullscr) {
                amt = (e.clientX / screen.width) * 100;
                vidseekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
                vidseekthumbvideo.currentTime = amt / 100 * video.duration;
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
                amt = ((e.clientX - vidcontrolsseekwrapper.getBoundingClientRect().left) / 1280) * 100;
                if (amt < 0) amt = 0;
                vidseekthumbtime.innerHTML = formatTime(amt / 100 * video.duration) + "";
                vidseekthumbvideo.currentTime = amt / 100 * video.duration;
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
            vidseekthumb.style.left = amt + "%";
            vidseekthumb.style.opacity = "1";
            vidseekthumbarrow.style.left = (50 + arrowoffset) + "%";
            vidcontrolsseekcanvas.height = 26;
            drawBuffers();
        }

        vidcontrolsseekwrapper.addEventListener("mouseout", function (e) {
            vidseekthumb.style.opacity = "0";
        })

        vidcontrolsplaypause.addEventListener("click", function () {
            playstate = togglePlayPause();
        });

        vidcontrolscurrenttime.innerHTML = formatTime(video.currentTime) + "";
        video.addEventListener('timeupdate', function () {
            vidcontrolscurrenttime.innerHTML = formatTime(video.currentTime) + "";
            vidcontrolsseek.style.width = ((video.currentTime / video.duration) * 100) + "%";
        });

        video.addEventListener('durationchange', function () {
            vidcontrolsendtime.innerHTML = formatTime(video.duration) + "";
        });
        vidcontrolsendtime.innerHTML = formatTime(video.duration) + "";

        vidcontrolsvolume.addEventListener("mousedown", function () {
            video.muted = !video.muted;
        });

        vidcontrolsvolumecontentbackground.addEventListener("mousedown", function (e) {
            var posx = 0;

            posx = clamp(e.clientX - this.getBoundingClientRect().left, 0, 100);
            video.volume = posx / 100;

            this.onmousemove = function (e) {
                posx = clamp(e.clientX - this.getBoundingClientRect().left, 0, 100);
                if (mousedown) video.volume = posx / 100;
            }
        });

        video.addEventListener('volumechange', function () {
            vidcontrolsvolumecontentbar.style.width = 100 * video.volume + "%";
            if (video.muted) {
                vidcontrolsvolumei.innerHTML = "volume_off";
            } else {
                if (this.volume > 0.5) {
                    vidcontrolsvolumei.innerHTML = "volume_up";
                } else if (this.volume > 0) {
                    vidcontrolsvolumei.innerHTML = "volume_down";
                } else {
                    vidcontrolsvolumei.innerHTML = "volume_mute";
                }
            }
        });
        vidcontrolsvolumecontentbar.style.width = 100 * video.volume + "%";

        vidcontrolsfullscreen.addEventListener("click", goFullscreen);

        vidcontainer.addEventListener("mouseover", function () {
            globalVideo = video;
            globalContainer = vidcontainer;
            globalCanvas = vidcontrolsseekcanvas;
            globalFullscreenIcon = vidcontrolsfullscreeni;
            globalControls = vidcontrols;
            globalCtx = ctx;
            globalPlaystate = playstate;
            globalSettingsMenu = vidcontrolssettingsmenu;
            globalSettings = vidcontrolssettings;
            drawBuffers();
        });

        return vidwrap;
    }
}
