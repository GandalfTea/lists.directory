

var ID = 0;




// READ LINK FOR DATA (if you open list)
checkLoad();

		// VARIOUS UI

// quick misplaced bug fix (do not judge)
$('#buttons').fadeOut(0);

// SET DATE

setTitle();
setInterval(function() {
	setTitle();
}, 1000);

function setTitle() {
	if(document.getElementById('menu-date').checked) {
		const date = new Date();
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'long' });
		const fullDate = day + " " + month;
		document.getElementById('date-top').innerText = fullDate; 

	} else if (document.getElementById('countdown').checked) {
		var midnight = new Date();
		midnight.setHours(24,0,0,0);
		var now = new Date();
		var hours = parseInt(Math.abs(midnight - now) / (1000 * 60 * 60) % 24);
		var min = parseInt(Math.abs(midnight.getTime() - now.getTime()) / (1000 * 60) % 60);
		var sec = parseInt(Math.abs(midnight.getTime() - now.getTime()) / (1000) % 60); 
		var time = String(hours + " : " + min + " : " + sec);
	
		document.getElementById('date-top').innerText = time; 
	}
}



		// INPUT TASKS


$(document).ready(function() {
	$('#newTask').keypress(function(e) {
		if(e.keyCode==13){
			if( /\S/.test($('#newTask').val())){
				var input = $('#newTask').val();
				createTask(input);
			}
		}
	})
})


function createTask(input) {
	var labl = document.createElement("label");
	labl.classList.add('container');
	labl.innerHTML = input + 
				"<input type='checkbox'>" +
				"<span class='checkmark'></span>" +
				"<button id='del' onclick='deleteTask(this.parentNode)'>" + 
				"<img src='./del.png' alt='delete' class='icon'></img>" +
				"</button>";

	var del = document.createElement("a");
	del.inerHTML = "<a id='del'></a>";

	labl.id = String(ID);
	ID += 1;
	$('#Tasks').append(labl);
	$('#newTask').val('');

	return labl;
}


// DELETE TASKS

function deleteTask(parent) {
	parent.remove();
}


		// BACKGROUND COLOR


function changeColor(color) {
	$('body').animate( { backgroundColor: color }, 'normal');
	$('#newTask').animate( {backgroundColor: color }, 0);
	$('#del').animate({ backgroundColor: color }, 'normal');
}


// BACKGROUND COLOR INPUT

$(document).ready(function() {
	$('#colorInput').keypress(function(e) {
		if(e.keyCode==13){
			if( /[0-9A-Fa-f]{6}/g.test($('#colorInput').val())){
				var input = $('#colorInput').val();
				changeColor("#" + input);
			}
		}
	})
})





		// OPTIONS MENU

function openOptions() {
	menuOpened = true;
	const popup = document.getElementById("popup");
	popup.classList.add('popup-open');

	// show buttons after closing deeper menus
	$('#buttons').fadeIn(200);

	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}



function clickOutside(e) {
	if(document.getElementById('popup').contains(e.target)){
	} else if (!(document.getElementById('popup').contains(e.target))){
		// this function runs later than the focus on the #newtask input.
		// make sure it does not falsely accept keybord shortcuts.
	 	if($('#newTask').is(':focus')) {
		} else{
			menuOpened = false;
		}
		closeOptions();
	}
}


function closeOptions() {

	console.log("CALLER : " + closeOptions.caller);

	const popup = document.getElementById('popup');
	popup.classList.remove('popup-open');
	popup.classList.remove('popup-save');
	popup.classList.remove('popup-load');
	popup.classList.remove('popup-send');
	popup.classList.remove('popup-improve');
	

	document.getElementById('options').setAttribute("onClick", "openOptions()");
	window.removeEventListener( "click", clickOutside);
	

	// Remove all other layout after closing
	// shitty way of doing it but it doesn't seem to be causing any performance issues
	$('#save-input').fadeOut(100, function() { $(this).remove(); });
	$('#save-button').fadeOut(100, function() { $(this).remove(); });
	$('.load-title').fadeOut(100, function() { $(this).remove(); });
	$('.load-enc').fadeOut(100, function() { $(this).remove(); });
	$('.send-notice').fadeOut(100, function() { $(this).remove(); });
	$('#send-guide-qr').fadeOut(100, function() { $(this).remove(); });
	$('#send-guide-copy').fadeOut(100, function() { $(this).remove(); });
	$('#qr').fadeOut(100, function() { $(this).remove(); });
	$('#send-copy').fadeOut(100, function() { $(this).remove(); });
	$('#improve-text').fadeOut(100, function() { $(this).remove(); });
	$('#improve-title').fadeOut(100, function() { $(this).remove(); });
	$('#improve-send').fadeOut(100, function() { $(this).remove(); });
	return;
}





		// SAVING AND SHARING

/*	
	* QR Code
	* Base64 Link
	* localStorage 
*/

var menuOpened = false;		// for keyboard shortcuts

// input name for saved list and add to localStorage.
// save name and tick status
function Save() {
	
	menuOpened = true;
		
	const popup = document.getElementById('popup');
	popup.classList.add('popup-save');
	$('#buttons').hide();
	popup.classList.remove('popup-open');	

	// UI
	var input = document.createElement('input');
	input.type = "text";
	input.className = "save-input";
	input.placeholder = "Name of list";
	input.id = "save-input";

	var save = document.createElement('button');
	save.classList.add('save-button');
	save.innerText = "Save";
	save.id = "save-button";

	popup.appendChild(input);
	popup.appendChild(save);

	// do not capture the shortcut 's'
	setTimeout(function() {
		$('#save-input').focus();
	}, 500);
	


	// PARSE AND SAVE IN MEMORY
	function saveLocal() {
		if( /\S/.test($('#save-input').val())){
			var input = $('#save-input').val();
			var items = {};
			const tasks = document.getElementById('Tasks').getElementsByTagName("label");

			for(let i of tasks) {
				if(i.getElementsByTagName("input")[0].checked){
					// TODO: this might be a shitty way to save checkmarks.
					// The initial idea was to have char that people would not use in tasks.
					items[i.id] = "`/" + i.innerHTML.split("<")[0];
				}else {
					items[i.id] = i.innerHTML.split("<")[0];
				}
			}
			window.localStorage.setItem(input, JSON.stringify(items));
			closeOptions();
		}
	}

	$('#save-input').keypress(function(e) {
		if(e.keyCode==13){		// Press ENTER
			saveLocal();
		}
	})
	
	$('#save-button').click( function() {
		saveLocal();
	})

	// CLOSE
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}

// read keys from localStorage and load on click.
function Load() {
	menuOpened = true;
	const popup = document.getElementById('popup');
	popup.classList.add('popup-load');
	$('#buttons').hide();
	popup.classList.remove('popup-open');	
	
	// UI
	var title = document.createElement("p");
	title.innerText = "Local Storage";
	title.classList.add('load-title');
	popup.appendChild(title);

	var enc = document.createElement("div");   //for scroll
	enc.classList.add("load-enc");
	
	var ul = document.createElement("ul");
	ul.classList.add("load-ul");


	// check if any entry
	if(Object.entries(localStorage) == 0){
		var really = document.createElement("img");
		really.src = './cat.jpg';
		really.id = 'really';
		enc.append(really);
	} else {
		$("really").remove();

		// read
		for(let i of Object.entries(localStorage)){
			var item = document.createElement('button');
			item.classList.add("load-item");
			item.innerText = i[0];
			item.setAttribute("onclick", "openList(this.innerHTML)");
	
			var del = document.createElement("button");
			var add = document.createElement("button");
			var img = document.createElement("img");
			var add_img = document.createElement("img");
			var container = document.createElement("div");
			
			// delete
			img.src = "./del.png";
			img.classList.add("icon");
			del.id = "del-load";
			del.appendChild(img);
			del.setAttribute("onclick", "delSave(this.parentElement)");

			// add to current list button
			add_img.src = './plus.png';
			add_img.id = 'load-add-img';
			add_img.classList.add('icon');
			add.appendChild(add_img);
			add.setAttribute("onclick", "openList(this.parentElement.getElementsByTagName('button')[1].innerHTML, true)")
			add.id = 'load-add';

			container.classList.add("load-container");
			
			container.appendChild(del);
			container.appendChild(item);
			container.appendChild(add);
			ul.appendChild(container);
		}
	}

	enc.appendChild(ul);
	popup.appendChild(enc);
	
	// CLOSE
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}

function delSave(save) {
	save.remove();
	window.localStorage.removeItem(save.innerText);
}

function openList(list, include = false) {

	if(include) {
		// do not remove
	}else {
		$('#Tasks').empty();
	}
		
	var rawItems = window.localStorage.getItem(list);
	var items = JSON.parse(rawItems);
	for(const i of Object.keys(items)) {
		var checked = false;
		if(items[i].includes("`/")){
			checked = true;
			items[i] = items[i].substr(2);
		}
		var id = createTask(items[i]);	
		if(checked){
			id.getElementsByTagName("input")[0].checked = true;
		}
	}
}




// Share as QR or Base64 Link
function Send() {
	menuOpened = true;
	const popup = document.getElementById('popup');
	popup.classList.add('popup-send');
	$('#buttons').hide();
	popup.classList.remove('popup-open');	

	// create link with variables
	var strings = "";
	const tasks = document.getElementById('Tasks').getElementsByTagName("label");

	//TODO: Change separator '/+/' because it takes too much memory
	for(let i of tasks) {
		if(i.getElementsByTagName("input")[0].checked){
			strings += "`/" + i.innerHTML.split("<")[0] + "/+/"; //identify checked tasks
		}else {
			strings += i.innerHTML.split("<")[0] + "/+/";
		}
	}

	content = btoa(strings);
	var load_url = `www.lists.directory/?content=${content}`;

	// qrcode.js had a bug that if the url len is between 192 - 220 it crashed.
	// padding to combat that.
	console.log(load_url.length);
	if(load_url.length >= 192 && load_url.length <= 220) {
		load_url += "?";
		while(load_url.length <= 220) {
			load_url += "=";
		}
	}
	

	//UI
	
	var guide = document.createElement("p");	
	guide.innerText = "Scan this with your phone camera";
	guide.id = "send-guide-qr";
	popup.appendChild(guide);

	
	// generate qr code and link embed.
	var qr_display = document.createElement("div");
	qr_display.id = "qr";
	popup.appendChild(qr_display);
	new QRCode(document.getElementById("qr"), load_url);
	
	var guide_url = document.createElement("p");	
	guide_url.innerText = "or copy and load this link";
	guide_url.id = "send-guide-copy";
	popup.appendChild(guide_url);


	var text = document.createElement("textarea");
	text.innerText = load_url;
	text.readOnly = true;
	text.id = "send-copy";
	popup.appendChild(text);


	// CLOSE
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}




// read URL variable and load data into list
function checkLoad() {
	var url = window.location.href;
	if(url.includes("content")) {
		var data = url.split("content");
		data = data[1].substring(1);
		data = data.split("?")[0];
		data = atob(data);
		data = data.split("/+/");
		data.splice(-1);

		for(var i of data) {
			var checked = false;
			if(i.includes("`/")){
				checked = true;
				i = i.substr(2);
			}
			var id = createTask(i);
			if(checked){
				id.getElementsByTagName("input")[0].checked = true;
			}
		}
	}
}


function Improve() {
	menuOpened = true;
	const popup = document.getElementById('popup');
	popup.classList.add('popup-improve');
	$('#buttons').hide();
	popup.classList.remove('popup-open');	


	// title text
	//textbox
	
	var title = document.createElement("p");
	title.id = 'improve-title';
	title.innerText = "Please share your experience and opinion about the website or ideas on how to improve it.";
	var text = document.createElement("textarea");
	text.id = 'improve-text';
	var form = document.createElement("form");
	form.setAttribute("data-netlify", "true");
	var send = document.createElement("button");
	send.id = 'improve-send';
	send.type = "submit";
	send.innerText = "Send";
	
	
	form.appendChild(text);
	form.appendChild(send);
	
	popup.appendChild(title);
	popup.appendChild(form);


	// CLOSE
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}



if(screen.width <= 900) {

} else {
	


	// Inform the user about the keybord shortcuts
	function infoPopup() {
		var div = document.createElement("div");
		var text = document.createElement("p");
		var exit = document.createElement("button");
		var img = document.createElement("img");
		
		img.src = './del.png'
		img.classList.add("icon");
		exit.appendChild(img);
		exit.id = 'info-popup-exit';
		exit.setAttribute("onclick", "infoPopupClose()");

		text.innerHTML = " <i><em>i</em></i> &ensp; for Input" + "<br>" +
						" <i><em>s</em></i> &ensp; for Save" + "<br>" + 
						" <i><em>l</em></i> &ensp; for Load" + "<br>" +
						" <i><em>m</em></i> &ensp; for Share" + "<br>";
		div.id='info-popup-div';
		text.id='info-popup-text';
		
		div.appendChild(exit);
		div.appendChild(text);

		$(document.body).append(div);
		$('#info-popup-div').fadeIn(300);
	}

	function infoPopupClose() {
		$('#info-popup-div').remove();
	}


	$(document).ready(function() {
		setTimeout(function() {
			infoPopup();
		}, 1000);
		
		setTimeout(function() {
				$('#info-popup-div').fadeOut( 300, function() { $(this).remove(); } );
		}, 10000);
	})
	// KEYBOARD SHORTCUTS


	// stop keybord shortcuts
	$('#newTask, #colorInput').focus(function() {
		menuOpened = true;
	})

	$('#newTask, #colorInput').focusout( function() {
		menuOpened = false;
	})


	// s, S for Save
	$(document).on("keypress", function(e) {
		if(e.key == 's' && !menuOpened || e.key == 'S' && !menuOpened) {
			Save();
			$('#save-input').val('');
		}
	})

	// l, L for Save
	$(document).on("keypress", function(e) {
		if(e.key == 'l' && !menuOpened || e.key == 'L' && !menuOpened) {
			Load();
		}
	})

	// m, M for Save
	$(document).on("keypress", function(e) {
		if(e.key == 'm' && !menuOpened || e.key == 'M' && !menuOpened) {
			Send();
		}
	})


	// Esc for exit
	$(document).on("keyup", function(e) {
		if(e.key == 'Escape') {
			if(menuOpened) {
				closeOptions();
			}
		}
	})

	// i for input new task
	$(document).on("keypress", function(e) {
		if(e.key == 'i' && !menuOpened) {
			setTimeout(function() {
				$('#newTask').focus();
			}, 50);
		}
	})

	$(document).on("keyup", function(e) {
		if(e.key == 'Escape') {
			if($('#newTask'.focus)) {
				$('#newTask').blur();
			}
		}
	})
}

// focus on input at startup 
$('#newTask').focus();
