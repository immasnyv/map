function Classrooms(mapJSON, mapHandler, ghrabApi) {
    var update_active = true;
    var update;
    var mode = 0;
    let avalaibleModes = ['subject', 'teacher', 'class'];

    this.init = function() {
        let slider = document.querySelector('#map .classrooms-selector .slider-input');
        let sliderText = document.querySelector('#map .classroom-slider-text');
        let classroomsInfo = document.querySelector('#map .classrooms-selector .info');

        let sliderBBox = slider.getBoundingClientRect();
        sliderText.style.setProperty('top', sliderBBox.top + 'px');
        let position = sliderBBox.left + (sliderBBox.width * (ghrabApi.getLessonNumber(this.lesson) - 1) / 9);
        sliderText.style.setProperty('left', position + 'px');

        this_rooms.updateLessonInInfo(classroomsInfo, this.lesson);
        this_rooms.updateDateInInfo(classroomsInfo, this.date);
        
        sliderText.innerHTML = 'Hodina: ' + this.lesson;
        slider.value = ghrabApi.getLessonNumber(this.lesson);

        function followMouse(ev) {
            sliderText.style.setProperty('left', ev.clientX + 'px');
            sliderText.style.setProperty('top', ev.clientY + 'px');
        }

        slider.addEventListener("mousedown", function(ev) {
            if(ev.button == 0) {
                sliderText.style.setProperty('display', 'initial');
                slider.addEventListener("mousemove", followMouse);
            }
        });
        slider.addEventListener("mouseup", function(ev) {
            sliderText.style.setProperty('display', 'none');
            slider.removeEventListener('mousemove', followMouse, false);
        });
        slider.addEventListener("input", function(ev) {
            sliderText.innerHTML = 'Hodina: ' + this.value;
        });        
        slider.addEventListener("change", function(ev) {
            this_rooms.showRooms(avalaibleModes[mode], this_rooms.date, this_rooms.lesson = this.value);
            this_rooms.updateLessonInInfo(classroomsInfo, this_rooms.lesson);
        });

        let plusButton = document.querySelector('#map .classrooms-selector .plus');
        let minusButton = document.querySelector('#map .classrooms-selector .minus');
        plusButton.addEventListener("click", function(ev) {
            this_rooms.lesson = ghrabApi.getLessonNumber(this_rooms.lesson);
            if(this_rooms.lesson + 1 <= 10) {
                this_rooms.showRooms(avalaibleModes[mode], this_rooms.date, ++this_rooms.lesson);
                this_rooms.updateLessonInInfo(classroomsInfo, this_rooms.lesson);
            }
        });
        minusButton.addEventListener("click", function(ev) {
            this_rooms.lesson = ghrabApi.getLessonNumber(this_rooms.lesson);
            if(this_rooms.lesson - 1 >= 1) {
                this_rooms.showRooms(avalaibleModes[mode], this_rooms.date, --this_rooms.lesson);
                this_rooms.updateLessonInInfo(classroomsInfo, this_rooms.lesson);
            }
        });

        let arrows = [].slice.call(document.querySelectorAll('#map .classrooms-selector .arrow'));
        arrows.forEach(function(arrow) {
            arrow.addEventListener("click", function(ev) {
                this_rooms.date.setDate(this_rooms.date.getDate() + (this.classList.contains('arrow__back') ? (-1) : +1));
                this_rooms.showRooms(avalaibleModes[mode], this_rooms.date, this_rooms.lesson);
                this_rooms.updateDateInInfo(classroomsInfo, this_rooms.date);
            });
        });

        let viewSelector = document.querySelector('#map .classrooms-selector .view-selection');
        let viewButton = document.querySelector('#map .classrooms-selector .view-button');
        let viewSelectorState = false;
        viewButton.addEventListener("change", function(ev) {
            if(viewSelectorState) {
                viewSelector.style.display = 'none';
                viewSelectorState = false;
            } else {
                viewSelector.style.display = 'flex';
                viewSelectorState = true;
            }
        });

        let viewButtonInputs = [].slice.call(document.querySelectorAll('#map .classrooms-selector .view-selection input'));
        viewButtonInputs.forEach(function(input) {
            input.addEventListener("change", function(ev) {
                if(input.checked) {
                    mode = viewButtonInputs.indexOf(input);
                    this_rooms.refresh(avalaibleModes[mode]);
                }
            });
        });

        let revert = document.querySelector('#map .classrooms-selector .revert');
        revert.addEventListener("click", function(ev) {
            this_rooms.date = new Date();
            this_rooms.lesson = ghrabApi.getLessonFromTime(this_rooms.date);

            this_rooms.showRooms(avalaibleModes[mode], this_rooms.date, this_rooms.lesson);

            let sliderBBox = slider.getBoundingClientRect();
            sliderText.style.setProperty('top', sliderBBox.top + 'px');
            let position = sliderBBox.left + (sliderBBox.width * (ghrabApi.getLessonNumber(this_rooms.lesson) - 1) / 9);
            sliderText.style.setProperty('left', position + 'px');

            this_rooms.updateLessonInInfo(classroomsInfo, this_rooms.lesson);
            this_rooms.updateDateInInfo(classroomsInfo, this_rooms.date);
            
            sliderText.innerHTML = 'Hodina: ' + this_rooms.lesson;
            slider.value = ghrabApi.getLessonNumber(this_rooms.lesson);
        });

        let pause = document.querySelector('#map .classrooms-selector .pause');
        let pauseBut = document.querySelector('#map .classrooms-selector .pause_button');
        let playBut = document.querySelector('#map .classrooms-selector .play_button');
        playBut.style.display= 'none';
        pauseBut.style.display= 'initial';
        pause.addEventListener("click", function(ev) {
            if(update_active) {
                playBut.style.display= 'initial';
                pauseBut.style.display= 'none';
                
                clearInterval(update);
                update_active = false;
            } else {
                playBut.style.display= 'none';
                pauseBut.style.display= 'initial';
                
                update = setInterval(this_rooms.updateClassrooms, 5000);
                update_active = true;
            }
        });
    };

    // Updates Lesson number (or text) in the info panel (above slider)
    this.updateLessonInInfo = function(infoBar, lesson) {
        infoBar.querySelector('.lesson').innerHTML = lesson;

        let revert = document.querySelector('#map .classrooms-selector .revert');
        if(lesson != ghrabApi.getLessonFromTime(new Date())) {
            revert.style.display = 'initial';
        } else {
            revert.style.display = 'none';
        }
    };

    // Updates Date in the info panel (above slider)
    this.updateDateInInfo = function(infoBar, date) {
        let euroDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
        infoBar.querySelector('.date').innerHTML = euroDate;

        let dateNow = new Date();
        let euroDateNow = dateNow.getDate() + '.' + (dateNow.getMonth() + 1) + '.' + dateNow.getFullYear();
        let revert = document.querySelector('#map .classrooms-selector .revert');
        if(euroDate != euroDateNow) {
            revert.style.display = 'initial';
        } else {
            revert.style.display = 'none';
        }
    };

    // This function is called every 5s in order to change type (mode) of label on rooms on map
    this.updateClassrooms = function() {
        let viewButtonInputs = [].slice.call(document.querySelectorAll('#map .classrooms-selector .view-selection input'));
        viewButtonInputs[mode].checked = true;

        let actualMode = avalaibleModes[mode];
        if(++mode > avalaibleModes.length - 1) {
            mode = 0;
        }

        this_rooms.refresh(actualMode);
    };
    
    // The same as showRooms with date and lesson not changed
    this.refresh = function(mode) {
        this.showRooms(mode, this_rooms.date, this_rooms.lesson);
    };

    // Initiates process of showing rooms based on received json
    this.showRooms = function(mode, date, lesson) {        
        let pauseBut = document.querySelector('#map .classrooms-selector .pause_button');
        pauseBut.style.display= 'none';
        let playBut = document.querySelector('#map .classrooms-selector .play_button');
        playBut.style.display= 'none'; 
        let loader = document.querySelector('#map .classrooms-selector .loader--icon');
        loader.style.display = 'inline-block';

        this_rooms.mode = mode;
        ghrabApi.getSchedule(this_rooms.showRoomsOk, this_rooms.showRoomsError, date, lesson);
    };
    
    // Function called from API - Data received -> call func to display them
    this.showRoomsOk = function(data) {
        this_rooms.clear();
        if(Object.keys(data).length != 0) {
            this_rooms.indicateRooms(data, this_rooms.mode);
        }

        let loader = document.querySelector('#map .classrooms-selector .loader--icon');
        loader.style.display = 'none';
        let pauseBut = document.querySelector('#map .classrooms-selector .pause_button');
        let playBut = document.querySelector('#map .classrooms-selector .play_button');
        if(update_active) {
            playBut.style.display= 'none';
            pauseBut.style.display= 'initial';
        } else {
            playBut.style.display= 'initial';
            pauseBut.style.display= 'none';
        }
    };

    // Function called from API - Data NOT received -> nothing happens
    this.showRoomsError = function(error) {
        let loader = document.querySelector('#map .classrooms-selector .loader--icon');
        loader.style.display = 'none';
        let pauseBut = document.querySelector('#map .classrooms-selector .pause_button');
        let playBut = document.querySelector('#map .classrooms-selector .play_button');
        if(update_active) {
            playBut.style.display= 'none';
            pauseBut.style.display= 'initial';
        } else {
            playBut.style.display= 'initial';
            pauseBut.style.display= 'none';
        }

        if(error == "Po výuce" || error == "Před výukou") {
            this_rooms.clear();
            return;
        }
    };

    // Loops in rooms and indicates rooms on map based on rooms (var)
    this.indicateRooms = function(rooms, mode) {  
        Object.keys(rooms).forEach(function(room) {
            if(rooms[room].class === undefined || rooms[room].subject === undefined) {
                return;
            }

            mapHandler.showRoom(parseInt(room), ghrabApi.toColor(rooms[room].subject_color));
            mapHandler.writeOnRoom(parseInt(room), mapJSON[parseInt(room)].level, rooms[room][mode], "map__text");
        });
    };

    // Clear used rooms in map
    this.clear = function() {
        mapHandler.deleteTextOnRooms('map__text');        
        mapHandler.unshowRooms();
    };

    // Exit this mode
    this.hide = function() {
        this_rooms.clear();
        document.querySelector('#map .classrooms-selector').style.display = 'none';
       
        if(update_active) {
            clearInterval(update);
        }
    };

    // Enter this mode
    this.show = function() {
        document.querySelector('#map .classrooms-selector').style.display = 'flex';

        this_rooms.updateClassrooms();

        if(update_active) {            
            update = setInterval(this_rooms.updateClassrooms, 5000);
        }
    };

    this_rooms = this;

    this.date = new Date();
    this.lesson = ghrabApi.getLessonFromTime(this.date);
    this.mode;

    this.init();
}