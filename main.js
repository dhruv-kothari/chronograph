var backgroundPage = chrome.extension.getBackgroundPage();
var totalTime = backgroundPage.totalTime;
var timeArray = backgroundPage.timeArray;

var now, HH, MM, SS, Day, Mon, weekDay, hh;
var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var colorArray = ['rgba(66, 133, 244, 0.5)','rgba(219, 68, 55, 0.5)','rgba(244, 160, 0, 0.5)','rgba(15, 157, 88, 0.5)',
                'rgba(66, 133, 244, 0.5)','rgba(219, 68, 55, 0.5)','rgba(244, 160, 0, 0.5)','rgba(15, 157, 88, 0.5)',
                'rgba(66, 133, 244, 0.5)','rgba(219, 68, 55, 0.5)','rgba(244, 160, 0, 0.5)','rgba(15, 157, 88, 0.5)',
                'rgba(66, 133, 244, 0.5)','rgba(219, 68, 55, 0.5)','rgba(244, 160, 0, 0.5)','rgba(15, 157, 88, 0.5)',
                'rgba(66, 133, 244, 0.5)','rgba(219, 68, 55, 0.5)','rgba(244, 160, 0, 0.5)','rgba(15, 157, 88, 0.5)'];

var quotes = ["Lost time is never found again.",
            "Time waits for no one.",
            "The trouble is, you think you have time.",
            "Every second is of infinite value.",
            "Don't be busy, be productive.",
            "Wasting time is robbing oneself."];

// 

updateCurrentTime();

formatTime();

displayCurrentTime();

setImage();

setWebsiteTime();

// update current time, date every second
setInterval(function() {
    updateCurrentTime();

    formatTime();

    displayCurrentTime();

    setImage();

    setWebsiteTime();
}, 1000);

// display any random quote
randomQuote();

// barchart
var ctx = document.getElementById('myChart').getContext('2d');
Chart.defaults.global.legend.display = false;
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: timeArray,
        datasets: [{
            label: '',
            backgroundColor: colorArray,
            minBarLength: 10,
            data: timeArray,
            borderColor: 'rgba(0,0,0,0.05)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {enabled: false},
        hover: {mode: null},
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    display: false
                }
            }]
        }
    }
});

// 

function updateCurrentTime() {
    now = new Date();
    HH = now.getHours();
    MM = now.getMinutes();
    SS = now.getSeconds();
    Day = now.getDate();
    Mon = now.getMonth();
    weekDay = now.getDay();
};

function formatTime() {
    hh = HH%12;
    if (hh == 0) hh = 12;
    if (MM < 10) MM = '0' + MM;
};

// display current time, date
function displayCurrentTime() {
    document.getElementById("time").innerHTML = `${hh}:${MM}`;
    document.getElementById("date").innerHTML = `${week[weekDay]}, ${Day} ${months[Mon]}`;
};

// set day/night image
function setImage() {
    var img = document.getElementById("image");
    var src;
    if (HH > 6 && HH < 21) src = "pics/day_colour.png";
    else src = "pics/night_colour.png";
    img.src = src;

};

// set display time on websites
function setWebsiteTime() {
    var timeDisplay = document.getElementById("timeDisplay");
    totalTime = backgroundPage.totalTime;
    timeDisplay.innerHTML = timeInWords(totalTime);
};

// convert seconds to time in words
function timeInWords(timeInSeconds) {
    var seconds = timeInSeconds%60;
    var minutes = Math.floor(timeInSeconds/60)%60;
    var hours = Math.floor(timeInSeconds/3600);

    var inWords = "";
    if (hours > 1) 
        inWords += hours + ' hours and ';
    else if (hours == 1)
        inWords += hours + ' hour and '
    if (minutes > 1)
        inWords += minutes + ' minutes ' ;
    else if (minutes == 1)
        inWords += minutes + ' minute '
    if (hours == 0) {
        if (minutes > 0) inWords += 'and '
        if (seconds == 1)
            inWords += seconds + ' second ';
        else
            inWords += seconds + ' seconds ';
    }
    return inWords;
};

function randomQuote() {
    var str;
    if (totalTime == 0) str = "Going great!";
    else str = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("text2").innerHTML = str;
};