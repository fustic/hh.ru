var Calendar = (function(window, document, Helpers, HtmlCreator, undefined){
    var options = {
            currentDate: null,
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

            searchTimeout: 0,
            tdWidth: 0
        },
        calendarEvents = {};
    var Calendar = {
        helpers: null,
        htmlCreator: null,
        init: function(params){
            var self = this;
            params = params || {};
            self._initEvents();
            self.helpers = params.helpers || Object.create(Helpers);
            self.htmlCreator = Object.create(HtmlCreator);
            options.currentDate = self.helpers.getTodayDate();
            options.tdWidth = (document.querySelector(".calendar:first-child").clientWidth / 7) + "px";
            self._loadEvents(params.events);
            self.renderMonth();

        },
        _initEvents: function(){
            var self = this,
                calendarHolder = document.getElementsByClassName("iCalendarHolder")[0],
                matches;
            (function(doc) {
                matches =
                    doc.matchesSelector ||
                        doc.webkitMatchesSelector ||
                        doc.mozMatchesSelector ||
                        doc.oMatchesSelector ||
                        doc.msMatchesSelector;
            })(document.documentElement);

            calendarHolder.getElementsByClassName("iPrevMonth")[0].addEventListener("click",function (e){
                options.currentDate.setMonth(options.currentDate.getMonth() - 1);
                self.renderMonth(options.currentDate);
            });
            calendarHolder.getElementsByClassName("iNextMonth")[0].addEventListener("click",function (e){
                options.currentDate.setMonth(options.currentDate.getMonth() + 1);
                self.renderMonth(options.currentDate);
            });
            calendarHolder.getElementsByClassName("iCurrentMonth")[0].addEventListener("click",function (e){
                options.currentDate = self.helpers.getTodayDate();
                self.renderMonth(options.currentDate);
            });
            document.addEventListener("click", function(e){
                var element = e.target;
                if (matches.call(element, ".iAddEvent")){
                    self.openFastCreate(element);
                }else if (matches.call(element, ".iClosePopup")) {
                    self.closePopUp(element);
                }else if (matches.call(element, ".iFastCreateEvent")) {
                    self.createEvent(element.previousSibling.value);
                    self.closePopUp(element);
                }else if (matches.call(element, ".iSearchAnswers li *")) {
                    self.openEvent(element);
                    self.closeAllPopUps();
                    document.getElementsByClassName("iSearch")[0].value = "";
                }else if (matches.call(element, ".iEvent, .iEvent *")){
                    self.editEvent(element);
                }else if (matches.call(element, ".iCreateEditEvent")){
                    self.editEventProperty(element);
                    self.closePopUp(element);
                }else if (matches.call(element, ".iDeleteEvent")){
                    self.deleteEvent(element);
                }else if (matches.call(element, ".iCalendar td, .iCalendar td > div, .iCalendar td > div > p, .iCalendar td div.iDayEventHolder")){
                    self.editEvent(element);
                }
            }, false);
            document.addEventListener("keydown", function(e){
                var element = e.target;
                if(e.keyCode === 13) {
                    if (matches.call(element, ".iEventCreateTitle")){
                        self.createEvent(element.value);
                        self.closePopUp(element);
                    }
                }
                if(e.keyCode === 27) {
                    self.closeAllPopUps();
                }
                if (matches.call(element, ".iSearch")){
                    clearTimeout(options.searchTimeout);
                    options.searchTimeout = setTimeout(function(){
                        self.searchEvents(element);
                    }, 400);

                }
            }, false);
            window.addEventListener('resize', function(event){
                options.tdWidth = (document.querySelector(".calendar:first-child").clientWidth / 7) + "px";
                [].forEach.call( document.querySelectorAll('.calendar td'), function(el) {
                    el.style.width = el.style.height = options.tdWidth;
                });
            });

        },
        _loadEvents: function(events){
            calendarEvents = this.getEventsFromStorage(events);
        },
        getEventsFromStorage: function(events){
            var _events = {},
                _loadedEvents,
                _event;
            if ( localStorage.calendarEvents ) {
                _loadedEvents = JSON.parse(localStorage.calendarEvents);
                for(var e in _loadedEvents) {
                    _event = _loadedEvents[e];
                    _events[e] = new CalendarEvent(_event.title, _event.description, new Date(_event.date), _event.participants, e);
                }
            } else {
                for(var i = 0, len = events.length; i < len; i += 1) {
                    _events[events[i].getId()] = events[i];
                }
                localStorage.calendarEvents = JSON.stringify(_events);
            }

            return _events;
        },
        renderMonth: function(date){
            date = date || options.currentDate;
            var self = this,
                table = self.htmlCreator.createMonth(self.getDaysOfMonth(date), options.tdWidth),
                calendar;
            calendar = document.getElementsByClassName("iCalendar")[0];
            calendar.innerHTML = "";
            calendar.appendChild(table);
            document.getElementsByClassName("iMonthYear")[0].innerHTML = options.months[date.getMonth()] + " " + date.getFullYear();
            self.renderEvents();
        },
        getDaysOfMonth: function(currentDate){
            currentDate = currentDate || options.currentDate;
            var self = this,
                date = new Date(currentDate.getFullYear(), currentDate.getMonth()),
                days = [], i, d,
                today = self.helpers.getTodayDate();
            //заполним пустые ячейки.. это случай когда 1-е число не понедельник
            for(i = 0, d = self.helpers.getDayOfWeek(date.getDay()); i < d; i++) {
                days.push({
                    value: new Date(date.getFullYear(), date.getMonth(), (date.getDate() - (d - i)) ),
                    isToday: false
                });
            }
            //пока не перейдем на следующий месяц - добавляем дни в массив.. с указанием текущей даты
            while(date.getMonth() === currentDate.getMonth()) {

                days.push({
                    value: new Date(date),
                    isToday: today.getTime() === date.getTime()
                });
                date.setDate(date.getDate()+1);
            }
            //и дополняем массив пустыми ячейками для случая, когда последний день не воскресенье
            for(i = self.helpers.getDayOfWeek(date.getDay()); i > 0 && i < 7; i++) {
                days.push({
                    value: new Date(date),
                    isToday: false
                });
                date.setDate(date.getDate()+1);
            }
            return days;
        },
        renderEvents: function(){
            var self = this,
                _event,
                currentDate = options.currentDate,
                eventHolder;
            for (var e in calendarEvents) {
                _event = calendarEvents[e];
                if(_event.isCurrentMonth(currentDate)) {
                    eventHolder = document.getElementById("day-"+_event.getDateToString());
                    if(eventHolder) {
                        eventHolder.appendChild(_event.toHtml());
                        eventHolder.parentNode.parentNode.className = "has-event";
                    }
                }
            }
        },
        openFastCreate: function(element){
            var box, self = this;
            if (element){
                box = document.getElementsByClassName("arrow_box")[0];
                if (box && box.parentNode) {
                    box.parentNode.removeChild(box);
                }
                element.parentNode.parentNode.appendChild(self.htmlCreator.createFastAddEventPopUp());
            }
        },
        closePopUp: function(element){
            var parent;
            if (element) {
                while (element && !(element.classList.contains("arrow_box") || element.classList.contains("arrow_box_left"))){
                    element = element.parentNode;
                }
                if (element && element.parentNode){
                    element.parentNode.removeChild(element);
                }
            }
        },
        closeAllPopUps: function(){
            var popups = document.getElementsByClassName("iClosePopup"),
                self = this;
            for(var i = 0, len = popups.length; i < len; i+=1) {
                self.closePopUp(popups[i]);
            }
        },
        createEvent: function(title, description, date, participants){
            var _event = new CalendarEvent(title, description, date, participants),
                eventHolder = document.getElementById("day-"+_event.getDateToString());
            if(eventHolder) {
                eventHolder.appendChild(_event.toHtml());
                eventHolder.parentNode.parentNode.className = "has-event";
            }
            calendarEvents[_event.getId()] = _event;
            this.saveEventsToStorage();

        },
        saveEventsToStorage: function(){
            localStorage.calendarEvents = JSON.stringify(calendarEvents);
        },
        editEvent: function(element){
            var id;
            if (!element){
                return;
            }
            while(element && !(element.classList.contains("iEvent") || element.tagName.toLowerCase() === "td")){
                element = element.parentNode;
            }
            if (element && element.id){
                this.openEditEventForm(calendarEvents[element.id.replace("event-","")]);
            }else {
                this.openEditEventForm(null, new Date(element.getAttribute("data-date")));
            }
        },
        openEditEventForm: function(event, date){
            var element, popup, cw, eventHolder;
            if (!event) {
                event = new CalendarEvent("", "", date, "");
                eventHolder = document.getElementById("day-"+event.getDateToString());
                eventHolder.appendChild(event.toHtml());
                calendarEvents[event.getId()] = event;
            }
            element = event.getHtmlElement();
            this.closeAllPopUps();
            while(element.tagName.toLowerCase() !== "td"){
                element = element.parentNode;
            }
            popup = this.htmlCreator.createEventEdit(event);

            document.getElementsByTagName("body")[0].appendChild(popup);
            cw = event.isLeft() ? element.clientWidth : -(popup.clientWidth-element.clientWidth/2);
            popup.style.left = element.getBoundingClientRect().left + cw + "px";
            popup.style.top = element.getBoundingClientRect().top + window.scrollY + "px";
            if (!event.isLeft()){
                popup.classList.add("right");
            }
        },
        searchEvents: function(element){
            if (element) {
                var self = this,
                    parent = element.parentNode,
                    value = element.value.toLowerCase();
                if (value && value.length && parent && !parent.querySelector(".iSearchAnswers")){
                    parent.appendChild(self.htmlCreator.createSearchAnswersPopup());
                }
                self.renderFilteredEvents(value);
            }
        },
        renderFilteredEvents: function(value){
            var self = this,
                ul = document.getElementsByClassName("iSearchAnswers")[0],
                _event;
            if (value && value.length) {
                ul.innerHTML = "";
                for (var e in calendarEvents){
                    _event = calendarEvents[e];
                if (_event.toSearchString().indexOf(value) !== -1) {
                        ul.appendChild(self.htmlCreator.createEventListItem(_event));
                    }
                }
            }
        },
        openEvent: function(element){
            var _event,
                date;
            if (element){
                while (element.tagName.toLowerCase() !== "li"){
                    element = element.parentNode;
                }
                _event = calendarEvents[element.id.replace("li-","")];
                date = _event.getDate();
                if (!(options.currentDate.getFullYear() === date.getFullYear() && options.currentDate.getMonth() === date.getMonth())) {
                    options.currentDate.setYear(date.getFullYear());
                    options.currentDate.setMonth(date.getMonth());
                    this.renderMonth(options.currentDate);
                }
                element = _event.getHtmlElement();
                element.classList.add("red");
                setTimeout(function(){
                    element.classList.remove("red");
                }, 700);

            }
        },
        deleteEvent: function(element){
            var id, _event;
            while (element && !element.classList.contains("iCreateEvent")){
                element = element.parentNode;
            }
            if (element) {
                id = element.id;
                if (id && id.length) {
                    _event = calendarEvents[id.replace("edit-","")];
                    _event.removeHtml();
                    calendarEvents[_event.getId()] = null;
                    delete calendarEvents[_event.getId()];
                    this.saveEventsToStorage();
                }
                this.closePopUp(element);
            }
        },
        editEventProperty: function(element){
            var parent = element.parentNode,
                id,
                _event;

            while (parent && !parent.classList.contains("iCreateEvent")){
                parent = parent.parentNode;
            }
            if (parent) {
                id = parent.id;
                if (id && id.length) {
                    _event = calendarEvents[id.replace("edit-","")];
                    _event.updateTitle(parent.querySelector("[event-prop='title']").value);
                    _event.updateParticipants(parent.querySelector("[event-prop='participants']").value);
                    _event.updateDescription(parent.querySelector("[event-prop='description']").value);
                    _event.updateHtml();
                    parent = _event.getHtmlElement();
                    while (parent && parent.tagName.toLowerCase() !== "td"){
                        parent = parent.parentNode;
                    }
                    if ( parent ){
                        parent.classList.add("has-event");
                    }

                    this.saveEventsToStorage();
                }
            }
        }
    };

    return Calendar;
})(window, document, Helpers, HtmlCreator);