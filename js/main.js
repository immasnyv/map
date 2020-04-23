var navigation;

function loaded() {
    var mapHandler = new MapHandler();
    var ghrabApi = new GhrabApi();

    navigation = new Navigation(mapJSON, mapNodesJSON, mapHandler);
    navigation.registerListener(navigationEnded);

    var classrooms = new Classrooms(mapJSON, mapHandler, ghrabApi);
    var staff = new Staff(mapJSON, mapHandler, ghrabApi);

    classrooms.show();
    var currentMapMode = 'Classrooms';
    document.querySelector('#map').style.setProperty('--vh', (window.innerHeight) + 'px');
    window.addEventListener("resize", function(ev) {
        document.querySelector('#map').style.setProperty('--vh', (window.innerHeight) + 'px');
    });

    let modeButtons = document.querySelectorAll('#map .mode-switch');
    modeButtons.forEach(function(modeButton) {
        modeButton.addEventListener("change", function(ev) {
            switch (ev.currentTarget.getAttribute('data-mode')) {
                default:
                case 'Classrooms':
                    if (currentMapMode == 'Staff') {
                        staff.hide();
                    } else if (currentMapMode == 'Navigator') {
                        navigation.hide();
                    }

                classrooms.show();
                break;

                case 'Navigator':
                    if (currentMapMode == 'Staff') {
                        staff.hide();
                    } else if (currentMapMode == 'Classrooms') {
                        classrooms.hide();
                    }

                    navigation.show();
                    break;

                case 'Staff':
                    if (currentMapMode == 'Navigator') {
                        navigation.hide();
                    } else if (currentMapMode == 'Classrooms') {
                        classrooms.hide();
                    }

                    staff.show();
                    break;
            }

            currentMapMode = ev.currentTarget.getAttribute('data-mode');
        });
    });

    let colorButtonInputs = [].slice.call(document.querySelectorAll('#map .theme-list input'));
    let colorButtonLabels = [].slice.call(document.querySelectorAll('#map .theme-list label'));

    let colorIndex = localStorage.getItem("color") || 0;
    let bg = getComputedStyle(colorButtonLabels[colorIndex]).getPropertyValue('background-color');
    let text = getComputedStyle(colorButtonLabels[colorIndex]).getPropertyValue('color');
    let bgGradient = getComputedStyle(colorButtonLabels[colorIndex]).getPropertyValue('--background-gradient');
    mapHandler.setColors(bg, text, bgGradient);
    colorButtonInputs[colorIndex].checked = 'checked';

    colorButtonInputs.forEach(function(input) {
        input.addEventListener("change", function(ev) {
            let colorIndex = colorButtonInputs.indexOf(input);
            let bg = getComputedStyle(colorButtonLabels[colorIndex]).getPropertyValue('background-color');
            let text = getComputedStyle(colorButtonLabels[colorIndex]).getPropertyValue('color');
            let bgGradient = getComputedStyle(colorButtonLabels[colorIndex]).getPropertyValue('--background-gradient');
            
            mapHandler.setColors(bg, text, bgGradient);
            localStorage.setItem("color", colorIndex);
        });
    });
}

function navigationEnded() {
    let startInput = document.querySelector("#map .navigator .input-start");
    let endInput = document.querySelector("#map .navigator .input-target");
    let buttonInput = document.querySelector("#map .navigator .input-button");

    startInput.disabled = false;
    endInput.disabled = false;
    buttonInput.disabled = false;
}

function start() {
    navigation.clear();

    let startInput = document.querySelector("#map .navigator .input-start");
    let endInput = document.querySelector("#map .navigator .input-target");
    let buttonInput = document.querySelector("#map .navigator .input-button");

    startInput.disabled = true;
    endInput.disabled = true;
    buttonInput.disabled = true;

    let startNumber = startInput.value;
    let endNumber = endInput.value;

    if (navigation.navigate(endNumber, startNumber) != 0) {
        alert('Zadána neexistující nebo nepodporovaná místnost');
        navigationEnded();
    }
}