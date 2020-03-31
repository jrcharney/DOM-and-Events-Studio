// Write your JavaScript code here.
// Remember to pay attention to page loading!

// 1. Use the `window.load` event to ensure all elements have loaded before attaching event handlers.
window.addEventListener('load',() => {
    // fields we use often
    let status   = document.querySelector("#flightStatus");
    let back     = document.querySelector("#shuttleBackground");    // The fence
    let altitude = document.querySelector("#spaceShuttleHeight");
    let rocket   = document.querySelector("#rocket");               // The sprite

    // get element property value
    function getEPV(el,prop){
        // Alternatively we could use parseInt, but parseFloat also works.
        return parseFloat(getComputedStyle(el).getPropertyValue(prop),10);
    }

    // set element property value
    // I probably won't use this one
    // TODO: Add a value for units? How about the importantce?
    function setEPV(el,prop,val){
        el.style.setProperty(prop,val);
    }

    // Let's add another variable to make sure that we can only use the D-pad
    // when take off happens (for some reason this isn't woring. Fix it later)
    //let use_dpad = false; //What if I don't set a value here (nope)
    //console.log(`use_dpad: ${use_dpad}`);

    // Let's get the sprite's default settings before we change anything
    let sprite_default = {
        x : `${getEPV(rocket,"left")}`, // it should be set to px
        y : `${getEPV(rocket,"top")}`
    }
    
    // Let's also set the boundaries of the fence the sprite is in
    // NOTE: pixel measurement is implied.
    // This is right. Apparently the sprite is much wider than I expected.
    let fence = {
        left   : 0,
        top    : 0,
        right  : getEPV(back,"width") - getEPV(rocket,"width"),    //400 - 75,
        bottom : getEPV(back,"height") - getEPV(rocket,"height")   //400 - 75
    }

    function dpadState(state){
        // We want the state to be the OPPOSITE of what we set it.
        Array.from(document.querySelectorAll("#dpad > button")).map(button => button.disabled = !state);
    }

    function getRocketPosition(){
        let x = getComputedStyle(rocket).getPropertyValue("left");
        let y = getComputedStyle(rocket).getPropertyValue("left");
        console.log(`(${x},${y})`);
    }

    //dpadState(false); // Actually I set these to disabled

    // Moved these to function
    function takeOff(){
        // a. A `window.confirm` should let the user know...
        // TODO: Let's see if this will work as a test. (Yeah, even though we could assign it to a boolean.)
        if(window.confirm("Confirm that the shuttle is ready for takeoff?")){
            status.innerHTML = "Shuttle in flight.";
            back.style.setProperty("background-color","blue");
            altitude.innerHTML = 10000; // this can actually be a number
            //use_dpad = true;
            //console.log(`use_dpad: ${use_dpad}`);

            // Enable the d-pad buttons
            dpadState(true);

            getRocketPosition();
        };
    }
    function landShip(){
        // a. A `window.alert` should let ht user know...
        window.alert("The shuttle is landing. Landing gear engaged.");
        status.innerHTML = "The shuttle is landing. Landing gear engaged.";
        back.style.setProperty("background-color","green");
        altitude.innerHTML = 0;

        dpadState(false);   // Disable the d-pad

        // TODO: Rocket should move back to the center if moved. (That's Bonus #2 actually)
        rocket.style.setProperty("left",`${sprite_default.x}px`);
        rocket.style.setProperty("top",`${sprite_default.y}px`);
        //getRocketPosition();
    }
    function abortMission(){
        // a. When the "Abort Mission" button is clicked...
        if(window.confirm("Confirm that you want to abort the mission?")){
            status.innerHTML = "Mission aborted.";
            back.style.setProperty("background-color","green");
            height.innerHTML = 0;
            
            dpadState(false);   // Disable the d-pad
            
            // Reset rocket location (Bonus #2)
            rocket.style.setProperty("left",`${sprite_default.x}px`);
            rocket.style.setProperty("top",`${sprite_default.y}px`);
            //getRocketPosition();
        };
    }

    // 2. When the "Take off" button is clicked:
    document.getElementById("takeoff").addEventListener("click",takeOff);

    // 3. When the "Land" button is clicked:
    document.getElementById('landing').addEventListener("click",landShip);

    // 4. When "Abort Mission" is clicked:
    document.getElementById('missionAbort').addEventListener("click", abortMission);

    // 5. When "Up", "Down", "Right", and "Left" buttons are clicked:
    // TODO: Add keyboard events!
    // TODO: What if we could rotate the shuttle when clicking left or right?
    // They should have considered playing around with HTML5 Canvas.
    // NOTE: Added ids to the buttons we want to control. The alternative would be a bunch of convoluted querySelectors.
    // NOTE: Left before Right, because I'm so used to that.
    // BONUS: Don't let the shuttle leave the parent element.

    function moveLeft(){
        let x = getEPV(rocket,"left") - 10;
        //console.log(x);
        if(x >= fence.left){
            rocket.style.setProperty("left",`${x}px`);
        }
    }

    function moveRight(){
        let x = getEPV(rocket,"left") + 10;
        //console.log(x);
        if(x <= fence.right){
            rocket.style.setProperty("left",`${x}px`);
        }
    }

    function moveUp(){
        altitude.innerHTML = parseInt(altitude.innerHTML) + 10000;
        // subtract 10 because the origin is in the top left!
        let y = getEPV(rocket,"top") - 10;
        //console.log(y);
        if(y >= fence.top){
            rocket.style.setProperty("top",`${y}px`);
        }
    }

    function moveDown(){
        let alt = parseInt(altitude.innerHTML);
        if( alt > 0){
            altitude.innerHTML = alt - 10000;
        }
        // add 10 because the origin in in the top left!
        let y = getEPV(rocket,"top") + 10;
        //console.log(y);
        if(y <= fence.bottom){
            rocket.style.setProperty("top",`${y}px`);
        }
    }

    document.getElementById("move_left").addEventListener("click", moveLeft);
    document.getElementById("move_right").addEventListener("click", moveRight);
    document.getElementById("move_up").addEventListener("click", moveUp);
    document.getElementById("move_down").addEventListener("click", moveDown);

    // This part could work, but I'll deal with it later.
    // TODO: Enable this on focus
    // TODO: Don't let keys be held down.
    /*
    document.addEventListener("keydown", (event) => {
        console.log(event.which);
        switch(event.which){
            case 13:    // Enter
                takeOff();
                break;
            case 27:    // ESC (abort!)
                abortMission();
                break;
            case 32:    // Space
                landShip();
                break;
            case 37:    // left arrow
                moveLeft();
                break;
            case 38:    // up arrow
                moveUp();
                break;
            case 39:    // right arrow
                moveRight();
                break;
            case 40:    // down arrow
                moveDown();
                break;
            default: break; // do nothing with other keys
        }
    });
    */
});