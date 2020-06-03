var backgroundPage = chrome.extension.getBackgroundPage();
var websitesToTrack = ["facebook.com","twitter.com","youtube.com"];

websitesToTrack = backgroundPage.websitesToTrack;


// close button to remove a website
var close = document.getElementsByClassName("close");

// set onclick function for add button 
document.getElementById("addBtn").addEventListener("click", newElement);

websitesToTrack.forEach(function(website){
	addElement(website);
});


// inserting a new website
function newElement() {
	var li = document.createElement("li");
	var inputWebsite = document.getElementById("myInput").value;
	inputWebsite = extractDomain(inputWebsite.replace(/ /g,''));

	if(isAlreadyAdded(inputWebsite)){
		alert('Already Added!');
		return;
	}

	var t = document.createTextNode(inputWebsite);
	li.appendChild(t);

	if (inputWebsite === '') {
		alert("You must write something!");
	} else {
		document.getElementById("myUL").appendChild(li);
        websitesToTrack.push(extractDomain(inputWebsite));
        chrome.storage.local.set({"websitesToTrack": websitesToTrack}, function(){});
	}
	document.getElementById("myInput").value = "";

	var span = document.createElement("SPAN");
	var txt = document.createTextNode("\u00D7");
	span.className = "close";
	span.appendChild(txt);
	li.appendChild(span);
	for (i = 0; i < close.length; i++) {
		close[i].onclick = function() {
			var div = this.parentElement;
			div.style.display = "none";
			var website = div.textContent.replace(/\u00D7/g,'');
			deleteWebsite(website);
            chrome.storage.local.set({"websitesToTrack": websitesToTrack}, function(){});
			// console.log(websitesToTrack);
		}
	}
}

// adding element from saved websitesToTrack
function addElement(website) {
	var li = document.createElement("li");
	var t = document.createTextNode(website);
	li.appendChild(t);

	if (website === '') {
		return;
	} else {
		document.getElementById("myUL").appendChild(li);
	}
	
	var span = document.createElement("SPAN");
	var txt = document.createTextNode("\u00D7");
	span.className = "close";
	span.appendChild(txt);
	li.appendChild(span);
	for (i = 0; i < close.length; i++) {
		close[i].onclick = function() {
			var div = this.parentElement;
			div.style.display = "none";
			var website = div.textContent.replace(/\u00D7/g,'');
			deleteWebsite(website);
            chrome.storage.local.set({"websitesToTrack": websitesToTrack}, function(){});
			// console.log(websitesToTrack);
		}
	}
}

// "https://www.google.com/abc/xyz/.." --> "google.com"
function extractDomain(str) {
	if(str == null) return null;
	var strList = str.split(":\/\/");
	if (strList.length > 1) str = strList[1];
	else str = strList[0];
	str = str.replace(/www\./g,'');
	var domainName = str.split('\/')[0];
	return domainName;
};

function isAlreadyAdded(website){
    return (websitesToTrack.indexOf(website) > -1);
};

function getIndex(website){
	return websitesToTrack.indexOf(website);
}

function deleteWebsite(website){
	var index = getIndex(website);
	if(index < 0) return;
	websitesToTrack.splice(index,1);
}

// // clear all websites
// function removeAll(){
// 	var lst = document.getElementsByTagName("ul");
// 	lst[0].innerHTML = "";
// 	websitesToTrack = [];
// }

