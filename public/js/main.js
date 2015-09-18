/*!
 * Javascript for navigation exercise at Huge inc
 *
 * Author: Jaime Clavijo
 * https://github.com/jacm365
 *
 * Date: 2015-08-21
 */

/**
* Setting
*/

var ajax = {}, i, j;
//do ajax get request
ajax.get = function (url, trigMethod) {
 	
 	if (self.fetch) { //for up to date browsers	
		fetch(url).then(function (response) {
			if(response.headers.get("content-type") === "application/json") {
				console.log("Success getting JSON");
			} else {
				console.log("Invalid response, expecting a JSON");
			}
			response.json().then(function(data) {  
		    	window[trigMethod](data);
		    });
		}).catch(function(error) {
  			console.log('Error: ' + error.message);
		});
	} else { //for explorer and outdated ones
		var xmlhttp;

	    if (window.XMLHttpRequest) {
	        // code for IE7+, Firefox, Chrome, Opera, Safari
	        xmlhttp = new XMLHttpRequest();
	    } else {
	        // code for IE6, IE5
	        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    }

	    xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
	           if(xmlhttp.status == 200){
	               window[trigMethod](JSON.parse(xmlhttp.responseText));
	           }
	           else if(xmlhttp.status == 400) {
	              console.log('There was an error 400')
	           }
	           else {
	               console.log('something else other than 200 was returned')
	           }
	        }
	    }

	    xmlhttp.open("GET", url, true);
	    xmlhttp.send();
	}
}

//Gets the data object and populates the nav
function populateNav(data){
	
	var htmlOutput = '';

	for (i in data.items) {
		
		var item = data.items[i],
		children = data.items[i].items.length,
		// For the class has-sub
		cClass = ''
		// For the HTML of children items
		cOutput = '',
		//URL
		URL = item.url,
		//chevron
		chevron = '';

		if (children > 0) {
			cClass = 'class = "has-sub"';
			cOutput += '<ul class="sub-nav">';
			chevron = '<img class="nav-chev" alt="chevron image" src=/images/chevron.png />';
			URL = 'javascript:void(0);';
			for (j in item.items) {
				var cItem = item.items[j];
				cOutput += '<li>';
				cOutput += '<a href="' + cItem.url + '">' + cItem.label + '</a>';
				cOutput += '</li>';
			}
			cOutput += '</ul>';
		}

 		htmlOutput += '<li '+ cClass +'>';
		htmlOutput += '<a href="' + URL + '" class="nav-item">';
		htmlOutput += item.label;
		htmlOutput += chevron;
		htmlOutput += '</a>';
		htmlOutput += cOutput;
		htmlOutput += '</li>';
	}

	document.getElementById('nav-items').innerHTML += htmlOutput;
	addNavListeners();
}

//Menu listeners
function addNavListeners() {
	
	var navItems = document.querySelectorAll('.nav-item');

	for (i=0; i < navItems.length; i++) {
		//reset because the window resize
		navItems[i].onclick = '';
		navItems[i].onmouseover = '';

		if (hasClass(navItems[i].parentElement, 'has-sub')) {
			var subNav = navItems[i].parentElement.querySelector('ul.sub-nav');
	    	subNav.onmouseleave = '';
		}
		
	    
	    navItems[i].onclick = function(){
	    	event.stopPropagation();
			navItemEvent(this);
		};
		if (!isMobile()) {
			navItems[i].onmouseover = function(){
				event.stopPropagation();
				navItemEvent(this);
			};
		}
	}
}

//Show sub nav
function navItemEvent(obj) {
	//For the clicks intended to close the sub nav
	if (isMobile() && hasClass(obj.parentElement, 'has-sub')) {
		var subNav = obj.parentElement.querySelector('ul.sub-nav');
	    if (subNav.style.opacity == 1) {//Check if open
	    	hideAll();
	    	return false;
	    }
	}
	//Close all the sub nav in any case
	hideAll();	
	
	if (hasClass(obj.parentElement, 'has-sub')) {
		//mobile checking
		if (isMobile()) {
			//sub nav elements handling
			var subNav = obj.parentElement.querySelector('ul.sub-nav');
			subNav.style.opacity = 1;
		    subNav.style.display = 'block';
		    //Handle chevron
		    var chev = obj.parentElement.querySelector('img.nav-chev');
		    chev.style.transform = 'rotate(180deg)';
		} else {
			//overlay handling
			var overlay = document.querySelector('#overlay');
			overlay.style.zIndex = 2;
			overlay.style.opacity = 1;
			//sub nav elements handling
			var subNav = obj.parentElement.querySelector('ul.sub-nav');
			subNav.style.opacity = 1;
		    subNav.style.display = 'block';
		    obj.style.backgroundColor = '#fff';
		    obj.style.color = '#ec008c';
		    subNav.onmouseleave = function(){
				hideAll();
			};
		}
	}
}
//Hide or show nav
function showNav(show) {
	var mobileNav = document.querySelector('#nav-cont')
	//padding 12px and margin copyright 100px 
	var docHeight = document.body.clientHeight;

	mobileNav.style.minHeight = docHeight+'px';
	if (show) {
		mobileNav.className = "nav-clicked";
		//overlay handling
		var overlayMobile = document.querySelector('#overlay-mobile');
		overlayMobile.style.zIndex = 2;
		overlayMobile.style.opacity = 1;
		overlayMobile.style.height = '100%';
	} 
	else {
		mobileNav.className = "";
		mobileNav.className = "";
		var overlayMobile = document.querySelector('#overlay-mobile');
		overlayMobile.style.zIndex = -1;
		overlayMobile.style.opacity = 0;
		overlayMobile.style.height = '0';
	}
}
//Clear colors nav
function clearColors() {
	var navMainItems = document.querySelectorAll(".nav-item");
	for (i=0; i < navMainItems.length; i++) {
	    navMainItems[i].style.color = '';
	    navMainItems[i].style.backgroundColor = '';
	}
}
//Hide all sub-nav
function hideAll(){
	var subNav = document.querySelectorAll('.sub-nav');
	for (i=0; i < subNav.length; i++) {
	    subNav[i].style.opacity = 0;
	    subNav[i].style.display = 'none';
	}
	if (isMobile()) {
		var chevs = document.querySelectorAll('img.nav-chev');
		for (i=0; i < chevs.length; i++) {
		    chevs[i].style.transform = 'rotate(0deg)';
		}
	} else {
		var navItems = document.querySelectorAll('.nav-item');
		for (i=0; i < navItems.length; i++) {
		    navItems[i].style.backgroundColor = '#ec008c';
		    navItems[i].style.color = '#fff';
		}
	}
	var overlay = document.querySelector('#overlay');
	overlay.style.zIndex = -1;
	overlay.style.opacity = 0;
}

//To check if its mobile
function isMobile() {
    var width = document.body.clientWidth;
    return width <= 767;
}

//Has Class
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

//Mobile nav icons effects
function iconsEffect() {
	var hamburger = document.querySelector('#hamburger')
	if (hamburger.className == "") hamburger.className = "ham-clicked";
	else hamburger.className = "";
	
	var closeIcon = document.querySelector('#close')
	if (closeIcon.className == "") closeIcon.className = "close-clicked";
	else closeIcon.className = "";

	var mobileLogo = document.querySelector('#mobile-logo')
	if (mobileLogo.className == "") mobileLogo.className = "logo-clicked";
	else mobileLogo.className = "";
}


var json = '', 
//nav json path
url = 'api/nav.json',
//method that gets the data when is ready
trigMethod = 'populateNav';

//using the ajax stuff
ajax.get(url, trigMethod);

//To close the dropdown
document.onclick = function() {
	if (!isMobile()) {
		hideAll();
	}
}

document.querySelector("#hamburger").onclick = function() {
	iconsEffect();
	showNav(true);
}
document.querySelector("#close").onclick = function() {
	iconsEffect();
	showNav(false);
}
document.querySelector('#overlay-mobile').onclick = function() {
	iconsEffect();
	showNav(false);
}

window.onresize = function() {
	addNavListeners();
	clearColors();
	if (!isMobile()) {
		hideAll();
	}
}