
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
				//snitch();
			}
		}
	})
})

var id = 1;

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

	labl.id = id;
	id += 1;
	$('#Tasks').append(labl);
	$('#newTask').val('');
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
					items[i.id] = i.innerHTML.split("<")[0];
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
		ul.appendChild(item);

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
	//console.log(list);	
	var rawItems = window.localStorage.getItem(list);
	var items = JSON.parse(rawItems);
	console.log(items);
	for(const i of Object.keys(items)) {
		createTask(items[i]);	
	}
}


function Send() {
	menuOpened = true;
	const popup = document.getElementById('popup');
	popup.classList.add('popup-send');
	$('#buttons').hide();
	popup.classList.remove('popup-open');	

	var notice = document.createElement("p");
	notice.innerText = "You will soon be able to send lists as QR codes or Data Links to your phone or other devices.\n Please contain your urges for the time being";
	notice.classList.add('send-notice');
	popup.appendChild(notice);
	
	// close
	document.getElementById('options').setAttribute("onClick", "closeOptions()");
	setTimeout(function(){
		window.addEventListener( "click", clickOutside);
	}, 500);
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
