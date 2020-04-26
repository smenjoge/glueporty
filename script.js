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
        daySchedule = JSON.parse(localStorage.getItem("daySchedule"));
        
        for(i=9; i < 18; i++) {
            if (firstIternation) {
                var newTimeBlock = $(".time-block:last");
                firstIternation = false;
            }
            else {
                var newTimeBlock = $(".time-block:last").clone();
            }
            
            newTimeBlock.find(".hour").attr({id: "timeSlot"+i, value: i});
            newTimeBlock.find(".hour").text(moment(i, "h").format("hh:mm A"));
            
            if (curentHour === i) {
                newTimeBlock.find("textarea").addClass("present");
            } 
            
            else if (curentHour < i) {
                newTimeBlock.find("textarea").addClass("future");
            }

            else if (curentHour > i) {
                newTimeBlock.find("textarea").addClass("past");
            }
            // find and populate text
            newTimeBlock.find("textarea").empty();
            if (daySchedule.dateObj == currentDate) {
                findTimeSlot = daySchedule.scheduleArr.find(({timeObj} ) => timeObj == i);
                if (findTimeSlot)  {
                    newTimeBlock.find("textarea").text(findTimeSlot.eventObj);
                }
            }

            $(".container").append(newTimeBlock);
        }
    };

    function saveEvent () {
        var dayScheduleStorage = JSON.parse(localStorage.getItem("daySchedule"));
        
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

        // dayScheduleStorage.dateObj = currentDate;
        
        localStorage.setItem("daySchedule", JSON.stringify(dayScheduleStorage));

    }

    $("#currentDay").text(getCurrentDayDate);
    loadDaySlots(); 
    $(".saveBtn").on("click", saveEvent);

});