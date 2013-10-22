var HtmlCreator = (function(window, document, Helpers, undefined){

    var helpers = Object.create(Helpers),
        options = {
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        }
        HtmlCreator = {
            createMonth: function(days, width){
                days = days || [];
                var self = this,
                    table = document.createElement("table"),
                    tbody = document.createElement("tbody"),
                    isFirstRaw = true,
                    tr = document.createElement("tr"),
                    day;
                table.className = "table";
                table.appendChild(tbody);
                tbody.appendChild(tr);
                //для каждого дня из массива создадим ячейку и добавим ее в таблицу в нужную строку
                for (var i = 0, daysLen = days.length; i < daysLen; i++) {
                    day = days[i];
                    tr.appendChild(self.createDay(day.value, isFirstRaw, day.isToday, width));
                    //если переходим на новую неделю - создаем новую строку
                    if(i % 7 === 6){
                        isFirstRaw = false;
                        tbody.appendChild(tr);
                        tr = document.createElement("tr");
                    }
                }
                //добавляем в таблицу последнюю строку
                tbody.appendChild(tr);
                return table;
            },
            createDay: function(date, isDayName, isCurrent, width){
                var self = this,
                    td = document.createElement("td"),
                    div = document.createElement("div"),
                    divEvent = document.createElement("div"),
                    p = document.createElement("p"),
                    span = document.createElement("span");
                td.className = isCurrent ? "current-date" : "";
                td.width = td.height = width;
                td.setAttribute("data-date", date);
                span.className = "iDayTitle";
                if (isDayName){
                    span.innerHTML = options.days[helpers.getDayOfWeek(date.getDay())] + " ";
                }
                span.innerHTML += date.getDate();

                p.appendChild(span);
                div.appendChild(p);
                divEvent.className = "iDayEventHolder day-events";
                divEvent.id = "day-"+ helpers.dateToString(date);
                div.appendChild(divEvent);
                td.appendChild(div);
                return td;
            },
            createFastAddEventPopUp: function(){
                var self = this,
                    div = document.createElement("div"),
                    input = document.createElement("input"),
                    button = document.createElement("button");

                div.className = "arrow_box col-md-5";
                div.appendChild(self.createCloseButtonPopup());
                input.type = "text";
                input.className = "form-control iEventCreateTitle";
                input.setAttribute("placeholder", helpers.dateToString(helpers.getTodayDate()) + ", Birth day");
                input.setAttribute("autofocus",true);
                div.appendChild(input);
                button.type = "button";
                button.className = "btn btn-default btn-xs iFastCreateEvent mb10";
                button.innerText = "Create";
                div.appendChild(button);
                return div;
            },
            createCloseButtonPopup: function(){
                var button = document.createElement("button");
                button.className = "close iClosePopup";
                button.setAttribute("aria-hidden", true);
                button.innerHTML = "&times;";
                button.type = "button";
                return button;
            },
            createEventEdit: function(event){
                var self = this,
                    div = document.createElement("div"),
                    row = document.createElement("div"),
                    title = document.createElement("input"),
                    span = document.createElement("span"),
                    participants = document.createElement("input"),
                    description = document.createElement("textarea"),
                    create = document.createElement("button"),
                    del = document.createElement("button");
                div.className = "arrow_box_left row event-create iCreateEvent";
                div.id = event ? "edit-"+event.getId() : "";
                row.className = "col-lg-12";
                row.appendChild(this.createCloseButtonPopup());

                title.type = "text";
                title.value = event ? event.getTitle() : "";
                title.className = "form-control iEventEditor";
                title.setAttribute("placeholder", "Event");
                title.setAttribute("event-prop","title");
                row.appendChild(title);
                span.innerHTML = event ? event.getDateToString() : helpers.dateToString(helpers.getTodayDate());
                row.appendChild(span);

                participants.type = "text";
                participants.value = event ? event.getParticipants() : "";
                participants.className = "form-control iEventEditor";
                participants.setAttribute("placeholder", "Participants");
                participants.setAttribute("event-prop","participants");
                row.appendChild(participants);

                description.className = "form-control iEventEditor";
                description.innerText = event ? event.getDescription() : "";
                description.rows = 5;
                description.setAttribute("placeholder", "Description");
                description.setAttribute("event-prop","description");
                row.appendChild(description);

                create.type = del.type = "button";
                create.className = del.className = "btn btn-default btn-sm";
                create.innerHTML = "Done";
                del.innerHTML = "Delete";
                create.classList.add("iCreateEditEvent");
                del.classList.add("iDeleteEvent");
                row.appendChild(create);
                row.appendChild(del);
                div.appendChild(row);
                return div;
            },
            createSearchAnswersPopup: function(){
                var div = document.createElement("div"),
                    ul = document.createElement("ul"),
                    close = this.createCloseButtonPopup();
                ul.className = "iSearchAnswers";
                div.className = "arrow_box col-md-10 search-answers";
                div.appendChild(ul);
                close.style.visibility = "hidden";
                div.appendChild(close);
                return div;
            },
            createEventListItem: function(event){
                var li,
                    b, p;
                li = document.createElement("li");
                li.id = "li-" + event.getId();
                b = document.createElement("b");
                b.innerText = event.getTitle();
                li.appendChild(b);
                p = document.createElement("p");
                p.innerText = event.getDateToString();
                li.appendChild(p);
                return li;
            }
        };

    return HtmlCreator;
})(window, document, Helpers);