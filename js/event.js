var CalendarEvent = function(title, description, date, participants, id){
    this.title = title || "";
    this.description = description || "";
    this.date = date || getTodayDate();
    this.participants = participants || "";
    this.id = id || Helpers.guid();
};
CalendarEvent.prototype = {
    updateTitle: function(title){
        if(title) {
            this.title = title;
        }
    },
    updateDescription: function(description){
        if(description) {
            this.description = description;
        }
    },
    updateParticipants: function(participants){
        if(participants) {
            this.participants = participants;
        }
    },
    getId: function(){
        return this.id;
    },
    getTitle: function(){
        return this.title;
    },
    getDateToString: function(){
        var self = this;
        return Helpers.dateToString(self.date);
    },
    getDate: function(){
        return this.date;
    },
    getParticipants: function(){
        return this.participants;
    },
    getDescription: function(){
        return this.description;
    },
    toHtml: function(){
        var self = this,
            html = [],
            div = document.createElement("div"),
            elems = self._getEventBodyHtml();
        div.className = "iEvent event";
        div.id = "event-"+self.getId();
        for (var i = 0, len = elems.length; i < len; i += 1){
            div.appendChild(elems[i]);
        }
        return div;
    },
    _getEventBodyHtml: function(){
        var self = this,
            html = [],
            pTitle = document.createElement("p"),
            b = document.createElement("b"),
            participants = document.createElement("p");
        b.innerHTML = self.title;
        pTitle.appendChild(b);
        participants.innerHTML = self.participants;
        html.push(pTitle);
        html.push(participants);
        return html;
    },
    getHtmlElement: function(){
        return document.getElementById("event-"+this.getId());
    },
    removeHtml: function(){
        var element;
        element = document.getElementById("event-"+this.getId());
        if (element && element.parentNode){
            element.parentNode.removeChild(element);
        }
    },
    updateHtml: function(){
        var element = document.getElementById("event-"+this.getId()),
            child = element.firstChild,
            elems = this._getEventBodyHtml();

        while ( child ) {
            element.removeChild( child );
            child = element.firstChild;
        }
        for (var j = 0, len = elems.length; j < len; j += 1){
            element.appendChild(elems[j]);
        }
    },
    toSearchString: function(){
        var self = this,
            _string = [];
        _string.push(self.title);
        _string.push(self.participants);
        _string.push(self.getDateToString());
        return _string.join("").replace(" ","").toLowerCase();
    },
    isCurrentMonth: function(date){
        date = date || getTodayDate();
        return this.date.getFullYear() === date.getFullYear() && this.date.getMonth() === date.getMonth();
    },
    isLeft: function(){
        return this.date.getDay() !== 0 && this.date.getDay() < 5 ? true : false;
    }
};