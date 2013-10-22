var calendar = Object.create(Calendar);
calendar.init({
    events: [
        new CalendarEvent("Meeting", "", new Date(2013, 9, 6), "Vladimir, Dmitriy"),
        new CalendarEvent("Drink!", "", new Date(2013, 9, 9), "Viktor, Ivan"),
        new CalendarEvent("B-day!", "", new Date(2013, 9, 22), "John")
    ],
    helpers: Object.create(Helpers)
});
