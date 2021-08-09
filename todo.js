
// SET DATE

setDate();

function setDate() {
	const date = new Date();
	const day = date.getDate();
	const month = date.toLocaleString('default', { month: 'long' });
	const fullDate = day + " " + month;

	//$('#date-top').text = fullDate;
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
}

