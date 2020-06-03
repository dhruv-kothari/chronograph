var activeTabUrl = "";
var activeDomain = "";
var isUserActive;
var data = {};
var today;
var totalTime;
var websitesToTrackDefault = ["facebook.com","twitter.com","youtube.com"];
var websitesToTrack = [];
var timeArray = [];


// load saved data or initialize if stored data not found
chrome.storage.local.get(null, function(storedData) {
    if (storedData["today"] != undefined) today = storedData["today"];
    else today = daysSinceUTC();
    if (storedData[today] != undefined) totalTime = storedData[today];
    else totalTime = 0;
    if (storedData.websitesToTrack != undefined) websitesToTrack = (storedData.websitesToTrack);
    else websitesToTrack = websitesToTrackDefault;
});

// chrome.runtime.onInstalled.addListener(function(details){
//     if(details.reason == "install"){
//         var data = {};

//         // Assign initial values to the variables
//         today = daysSinceUTC();
//         totalTime = 0;
//         websitesToTrack = websitesToTrackDefault;

//         // Store the values in the localStorage
//         data["today"] = today;
//         data[today] = totalTime;
//         data["websitesToTrack"] = websitesToTrackDefault;
//         chrome.storage.local.set(data, function(){});
//     }
// }); 

isUserActive = true;
buildArray();

// // click extension icon to open new tab, disabled due to popup on clicking it
// chrome.browserAction.onClicked.addListener(function(activeTab) {
//     if (activeTab.url != "chrome://newtab/") {
//         chrome.tabs.create({url:"chrome://newtab/"});
//     } else {
//         chrome.tabs.update({url:"chrome://newtab/"});
//         chrome.tabs.create({url:"/popup.html"});
//     }
// });

// every 5 seconds, check for new day and save data
setInterval(function() {
    if (isNewDay()) {
        today = daysSinceUTC();
        totalTime = 0;
        // remove a day and add today to array
        timeArray.shift();
        timeArray.push(totalTime);
    }
    var newData = {};
    newData["today"] = today;
    newData[today] = totalTime;
    newData["websitesToTrack"] = websitesToTrack;
    chrome.storage.local.set(newData, function(){});
}, 5*1000);

// every second, update time spent
setInterval(function() {
    updateActiveTabUrl();

    updateTotalTime();
    
    updateArray();
}, 1000);


// days since 1 Jan 1970
function daysSinceUTC() {
    var NUM_MILI_IN_A_DAY = 24*60*60*1000;
    var today = new Date();
    var utcMili = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return (utcMili/ NUM_MILI_IN_A_DAY);
};

function isNewDay() {
    return (daysSinceUTC()-today > 0);
};

// current url of active tab
function updateActiveTabUrl() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length < 1) {
            activeTabUrl = null;
        } else {
            activeTabUrl = tabs[0].url;
        }
    });
};

function isUserActiveNow() {
    chrome.windows.getCurrent(function(window) {
        isUserActive = window.focused;
    });
    return isUserActive;
};

// "https://www.google.com/abc/xyz/.." --> "google.com"
function extractDomain(str) {
    if (str == null) return null;
    var strList = str.split(":\/\/");
    if (strList.length > 1) str = strList[1];
    else str = strList[0];
    str = str.replace(/www\./g,'');
    var domainName = str.split('\/')[0];
    return domainName;
};

function getActiveWebsite() {
    return extractDomain(activeTabUrl);
};

// check if this website is to be tracked
function isTrackedWebsite(domain) {
    return (websitesToTrack.indexOf(domain) > -1);
};

function updateTotalTime() {
    var currDomain = getActiveWebsite();
    if (isUserActiveNow() && isTrackedWebsite(currDomain)) {
        totalTime += 1;
    }
};

// build array of time spent for past 20 days
function buildArray() {
    var len = 20;
    timeArray =[];
    // load data for past "len" days and push to array
    chrome.storage.local.get(null, function(storedData) {
        for(var i=len-1; i>-1; i--){
            if (storedData[today - i] == undefined) timeArray.push(0);
            else timeArray.push(storedData[today - i]);
        }
    });
};

function updateArray() {
    var len = timeArray.length;
    timeArray[len-1] = totalTime;
}
