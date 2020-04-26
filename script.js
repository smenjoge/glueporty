$(document).ready(function() {
    var firstIternation = true;
    var currentDate;
    var currentDayDate;
    var daySchedule = {
            dateObj: " ",
            scheduleArr: []
    };
    
    // Function to display curret date and Day in the page header
    function getCurrentDayDate () {
        currentDate = moment().format('YYYY-MM-DD');
        currentDayDate = moment().format('dddd, MMMM Do YYYY');
        return currentDayDate;
    };

    //Function to load all time slots on page load. 
    function loadDaySlots () {
        var curentHour = moment().hour(); //get the value of current hour
        
        //Get the schedule data stored in local storage. If no data found, initialize the object 
        var dayScheduleStorage = JSON.parse(localStorage.getItem("daySchedule"));
        if (!dayScheduleStorage) {
            dayScheduleStorage = daySchedule;
        }

        //Load the time slots from 9am to 5pm on page.  
        for(i=9; i < 18; i++) {
            if (firstIternation) {
                var newTimeBlock = $(".time-block"); //For loading first time slot, use the existing HTML element
                firstIternation = false;
            }
            else {
                //For loading all subsequent slots, clone the existing HTML element
                var newTimeBlock = $(".time-block:last").clone(); 
            }

            var hourEl = newTimeBlock.find(".hour");
            hourEl.attr({id: "timeSlot"+i, value: i});
            hourEl.text(moment(i, "h").format("hh:mm A"));
            
            var textAreaEl = newTimeBlock.find("textarea");
            textAreaEl.attr("disabled", false);//reset the disabled attribute

            var buttonEl = newTimeBlock.find(".saveBtn");
            buttonEl.attr("disabled", false);//reset the disabled attribute

            if (curentHour === i) {
                textAreaEl.addClass("present");
            } 
            
            else if (curentHour < i) {
                textAreaEl.addClass("future");
            }

            else if (curentHour > i) {
                textAreaEl.attr("disabled", true);//For past timeslots disable textarea
                buttonEl.attr("disabled", true);//For past timeslots disable Save button
                textAreaEl.addClass("past");
            }
            
            textAreaEl.empty(); //empty the textarea field in case it has any value from previous cloned element
            
            // find if any data is saved in local storage for the current timeslot. If found, get the 
            // value from local storage and display on the page
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
        //Get the schedule data stored in local storage. If no data found, initialize the object 
        var dayScheduleStorage = JSON.parse(localStorage.getItem("daySchedule"));
        if (!dayScheduleStorage || dayScheduleStorage.dateObj != currentDate ) {
            daySchedule.dateObj = currentDate;
            dayScheduleStorage = daySchedule;
        }

        var parentElModify = $(this).parents(".time-block"); //get reference to the time-block that is modified
        var hourModify = parentElModify.find(".hour").attr("value");//check which hour time-block is modified
        var toDoModify = parentElModify.find(".toDoClass").val();//get the new value entered in the textarea 

        var newtimeEventObj = {
            timeObj: hourModify,
            eventObj: toDoModify
        };

        // find if the event already exists for the timeslot that user clicked on
        var findscheduleObj = dayScheduleStorage.scheduleArr.find(({timeObj} ) => timeObj == hourModify);

        //If found, replace the array element with new value. if not found, push a new element to the array 
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