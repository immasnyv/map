function Classrooms(mapJSON, mapHandler, ghrabApi) {
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
            this_rooms.showRooms('subject', this_rooms.date, this_rooms.lesson = this.value);
            this_rooms.updateLessonInInfo(classroomsInfo, this_rooms.lesson);
        });

        let arrows = [].slice.call(document.querySelectorAll('#map .classrooms-selector .arrow'));
        arrows.forEach(function(arrow) {
            arrow.addEventListener("click", function(ev) {
                this_rooms.date.setDate(this_rooms.date.getDate() + (this.classList.contains('arrow__back') ? (-1) : +1));
                this_rooms.showRooms('subject', this_rooms.date, this_rooms.lesson);
                this_rooms.updateDateInInfo(classroomsInfo, this_rooms.date);
            });
        }); 
    }

    this.updateLessonInInfo = function(infoBar, lesson) {
        infoBar.querySelector('.lesson').innerHTML = lesson;
    }

    this.updateDateInInfo = function(infoBar, date) {
        let euroDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
        infoBar.querySelector('.date').innerHTML = euroDate;
    }
    
    this.refresh = function(mode) {
        this.showRooms(mode, this_rooms.date, this_rooms.lesson);
    }

    this.showRooms = function(mode, date, lesson) {
        let loader = document.querySelector('#map .loader');
        loader.style.display = 'initial';

        this_rooms.mode = mode;
        ghrabApi.getSchedule(this_rooms.showRoomsOk, this_rooms.showRoomsError, date, lesson);
    }
    
    this.showRoomsOk = function(data) {
        this_rooms.clear();
        if(Object.keys(data).length != 0) {
            this_rooms.indicateRooms(data, this_rooms.mode);
        }

        let loader = document.querySelector('#map .loader');
        loader.style.display = 'none';
    }

    this.showRoomsError = function(error) {
        let loader = document.querySelector('#map .loader');
        loader.style.display = 'none';

        if(error == "Po výuce" || error == "Před výukou") {
            return;
        }

        // let's show demo at least -->
        this_rooms.clear();
        this_rooms.indicateRooms(schedule, this_rooms.mode);        
    }

    this.indicateRooms = function(rooms, mode) {  
        Object.keys(rooms).forEach(function(room) {
            //console.log(room, rooms[room]);

            if(rooms[room].class === undefined || rooms[room].subject === undefined) {
                return;
            }

            mapHandler.showRoom(parseInt(room), ghrabApi.toColor(rooms[room].subject_color));
            mapHandler.writeOnRoom(parseInt(room), mapJSON[parseInt(room)].level, rooms[room][mode], "map__text");
        });
    }

    this.clear = function() {
        mapHandler.deleteTextOnRooms('map__text');        
        mapHandler.unshowRooms();
    }

    this.hide = function() {
        this_rooms.clear();
        document.querySelector('#map .classrooms-selector').style.display = 'none';
    }

    this.show = function() {
        document.querySelector('#map .classrooms-selector').style.display = 'flex';
    }

    this_rooms = this;

    this.date = new Date();//('22 Mar 2020 12:15');
    this.lesson = ghrabApi.getLessonFromTime(this.date);
    this.mode;

    this.init();
}