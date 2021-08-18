

var ID = 0;



// READ LINK FOR DATA (if you open list)
checkLoad();

// SET DATE

setDate();

function setDate() {
	const date = new Date();
	const day = date.getDate();
	const month = date.toLocaleString('default', { month: 'long' });
	const fullDate = day + " " + month;

	document.getElementById('date-top').innerText = fullDate;
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
	$('#popup').animate({ backgroundColor: color }, 'normal');
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
	} else {
		closeOptions();
	}
}


function closeOptions() {
	const popup = document.getElementById('popup');
	popup.classList.remove('popup-open');
	popup.classList.remove('popup-save');
	popup.classList.remove('popup-load');
	popup.classList.remove('popup-send');
	

	document.getElementById('options').setAttribute("onClick", "openOptions()");
	window.removeEventListener( "click", clickOutside);
	

	// Remove all other layout after closing
	$('#save-input').fadeOut(100, function() { $(this).remove(); });
	$('#save-button').fadeOut(100, function() { $(this).remove(); });
	$('.load-title').fadeOut(100, function() { $(this).remove(); });
	$('.load-enc').fadeOut(100, function() { $(this).remove(); });
	$('.send-notice').fadeOut(100, function() { $(this).remove(); });
	$('#send-guide-qr').fadeOut(100, function() { $(this).remove(); });
	$('#send-guide-copy').fadeOut(100, function() { $(this).remove(); });
	$('#qr').fadeOut(100, function() { $(this).remove(); });
	$('#send-copy').fadeOut(100, function() { $(this).remove(); });
	menuOpened = false;
}



/*	
	* QR Code Share 
	* Base64 String Share
	* localStorage Save
*/

var menuOpened = false;		// for keyboard shortcuts

// input name for saved list and add to localStorage.
// only save name of task.
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

	$('#save-input').focus();
	
	// Save	
	// Press Enter
	$('#save-input').keypress(function(e) {
		if(e.keyCode==13){
			if( /\S/.test($('#save-input').val())){
				var input = $('#save-input').val();
				var items = {};
				const tasks = document.getElementById('Tasks').getElementsByTagName("label");

				for(let i of tasks) {
					if(i.getElementsByTagName("input")[0].checked){
						items[i.id] = "`/" + i.innerHTML.split("<")[0];
					}else {
						items[i.id] = i.innerHTML.split("<")[0];
					}
				}
				window.localStorage.setItem(input, JSON.stringify(items));
				closeOptions();
				//console.log(window.localStorage.getItem(input));
			}
		}
	})
	
	$('#save-button').click( function() {
		var items = {};
		const tasks = document.getElementById('Tasks').getElementsByTagName("label");

		for(let i of tasks) {
			items[i.id] = i.innerHTML.split("<")[0];
		}
		var input = $('#save-input').val();
		window.localStorage.setItem(input, JSON.stringify(items));
		closeOptions();
	})

	// Close
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}

// read keys from localStorage and load on click.
// TODO: Load from QR and Base64.
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


	// read
	for(let i of Object.entries(localStorage)){
		var item = document.createElement('button');
		item.classList.add("load-item");
		item.innerText = i[0];
		item.setAttribute("onclick", "openList(this.innerHTML)");

		var del = document.createElement('button');
		var img = document.createElement("img");
		var container = document.createElement("div");
		img.src = "./del.png";
		img.classList.add("icon");
		del.id = "del-load";
		del.appendChild(img);
		del.setAttribute("onclick", "delSave(this.parentElement)");
		container.classList.add("load-container");


		container.appendChild(del);
		container.appendChild(item);
		ul.appendChild(container);

	}

	enc.appendChild(ul);
	popup.appendChild(enc);
	

	// QR and Base64
	// . . .


	// close
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}

function openList(list) {
	$('#Tasks').empty();
	var rawItems = window.localStorage.getItem(list);
	var items = JSON.parse(rawItems);
	//console.log(items);
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


function Send() {
	menuOpened = true;
	const popup = document.getElementById('popup');
	popup.classList.add('popup-send');
	$('#buttons').hide();
	popup.classList.remove('popup-open');	

	// put in container
	
	// create link with variables
	var strings = "";
	const tasks = document.getElementById('Tasks').getElementsByTagName("label");

	for(let i of tasks) {
		if(i.getElementsByTagName("input")[0].checked){
			strings += "`/" + i.innerHTML.split("<")[0] + "/+/"; //identify checked tasks
		}else {
			strings += i.innerHTML.split("<")[0] + "/+/";
		}
	}

	content = btoa(strings);
	var load_url = `www.todolist.live/?content=${content}`;

	// qrcode.js had a bug that if the url len is between 192 - 220 it crashed.
	// padding to combat that.
	console.log(load_url.length);
	if(load_url.length >= 192 && load_url.length <= 220) {
		load_url += "?";
		while(load_url.length <= 220) {
			load_url += "=";
		}
	}
	console.log(load_url.length);

	
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
	guide_url.innerText = "Or copy and load this link";
	guide_url.id = "send-guide-copy";
	popup.appendChild(guide_url);


	var text = document.createElement("textarea");
	text.innerText = load_url;
	text.readOnly = true;
	text.id = "send-copy";
	popup.appendChild(text);


	// close
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
}


// delete save from localStorage.
// called in Load().
function delSave(save) {
	save.remove();
	window.localStorage.removeItem(save.innerText);
}





// read URL variable and load data into list
function checkLoad() {
	var url = window.location.href;
	if(url.includes("content")) {
		//console.log("DATA LINK FOUND");
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

// Esc for exit
$(document).on("keyup", function(e) {
	if(e.key == 'Escape') {
		if(menuOpened) {
			closeOptions();
		}
	}
})

$(document).on("keyup", function(e) {
	if(e.key == 'Escape') {
		if($('#newTask'.focus)) {
			$('#newTask').blur();
		}
	}
})


