$(document).ready(function() {
    var firstIternation = true;
    var currentDate;
    var currentDayDate;
    var daySchedule = {
            dateObj: " ",
            scheduleArr: []
    };
    

    function getCurrentDayDate () {
        currentDate = moment().format('YYYY-MM-DD');
        currentDayDate = moment().format('dddd, MMMM Do YYYY');
        return currentDayDate;
    };

    function loadDaySlots () {
        var curentHour = moment().hour();
        var dayScheduleStorage = JSON.parse(localStorage.getItem("daySchedule"));
        
        if (!dayScheduleStorage) {
            dayScheduleStorage = daySchedule;
        }


        for(i=9; i < 18; i++) {
            if (firstIternation) {
                var newTimeBlock = $(".time-block:last");
                firstIternation = false;
            }
            else {
                var newTimeBlock = $(".time-block:last").clone();
            }

            var hourEl = newTimeBlock.find(".hour");
            hourEl.attr({id: "timeSlot"+i, value: i});
            hourEl.text(moment(i, "h").format("hh:mm A"));
            
            var textAreaEl = newTimeBlock.find("textarea");
            textAreaEl.attr("disabled", false);

            var buttonEl = newTimeBlock.find(".saveBtn");
            buttonEl.attr("disabled", false);

            if (curentHour === i) {
                textAreaEl.addClass("present");
            } 
            
            else if (curentHour < i) {
                textAreaEl.addClass("future");
            }

            else if (curentHour > i) {
                textAreaEl.attr("disabled", true);
                buttonEl.attr("disabled", true);
                textAreaEl.addClass("past");
            }
            // find and populate text
            textAreaEl.empty();
            if (dayScheduleStorage.dateObj == currentDate) {
                findTimeSlot = dayScheduleStorage.scheduleArr.find(({timeObj} ) => timeObj == i);
                if (findTimeSlot)  {
                    textAreaEl.text(findTimeSlot.eventObj);
                }
            }

            $(".container").append(newTimeBlock);
        }
    };

    function saveEvent () {
        var dayScheduleStorage = JSON.parse(localStorage.getItem("daySchedule"));
        
        if (!dayScheduleStorage) {
            daySchedule.dateObj = currentDate;
            dayScheduleStorage = daySchedule;
        }

        var parentElModify = $(this).parents(".time-block");
        var hourModify = parentElModify.find(".hour").attr("value");
        var toDoModify = parentElModify.find(".toDoClass").val();

        var newtimeEventObj = {
            timeObj: hourModify,
            eventObj: toDoModify
        };

        // find if the event already exists for the timeslot that user clicked on
        var findscheduleObj = dayScheduleStorage.scheduleArr.find(({timeObj} ) => timeObj == hourModify);

        if (findscheduleObj) {
            var indexofScheduleObj = dayScheduleStorage.scheduleArr.indexOf(findscheduleObj);
            dayScheduleStorage.scheduleArr.splice(indexofScheduleObj, 1, newtimeEventObj);
        } else {
            dayScheduleStorage.scheduleArr.push(newtimeEventObj);
        }
        
        localStorage.setItem("daySchedule", JSON.stringify(dayScheduleStorage));

    }

    $("#currentDay").text(getCurrentDayDate);
    loadDaySlots(); 
    $(".saveBtn").on("click", saveEvent);

});