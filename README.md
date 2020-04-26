# glueporty
Day Planner Homework (wk5)
1) Using provided html and CSS files, added new div inside the container class for one timeslot to display on the page.
2) Bootstrap class "input-group" is used to display timeslot value, textarea and Save button.
3) In script.js, the first fucntion to execute is to get current day and date value and display it in the p tag with id = "currentDay"
4) Then all timeslots for a given workday (9am to 5pm) are displayed. To do this, the the html element with class 'time-block' is cloned and modified as needed.
5) If a time slot is already passed for the current day, the textarea and save button are disabled to prevent user from changing the values. 
6) If user has already set a reminder/meeting/thingToDo for a particular timeslot, its value is fetched from the local storage and displayed in that timeslot textarea. 
7) When user enters/changes the value in a textarea, the value is stored in local storage in the form of an object. Two properties in the object represent the hour value and the text value. 