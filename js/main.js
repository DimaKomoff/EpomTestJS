document.addEventListener('DOMContentLoaded', function() {
	// declaration of variables
	var taskList = document.getElementById('taskList');
	var editButtons, delButtons, saveButtons;
	taskList.innerHTML +=
		'<table id="myTable" class="table table-hover table-bordered table-striped"><thead><tr><th>Name</th><th>Age</th><th>controls</th></tr></thead><tbody></tbody></table>';
	var storage = window.localStorage;
	var key = 'data'; // name of key in localStorage
	var tasks; //array of tasks in localStorage

	// function calls
	tasksDef();
	initData();

	function random() {
		return Math.floor(Math.random() * (1000000000 - 1)) + 1; //to set the item ID
	}

	function getData(key) {
		return JSON.parse(storage.getItem(key)); //get storage data
	}

	function setData(key, data) {
		storage.setItem(key, JSON.stringify(data)); //set storage data
	}

	function tasksDef() {
		if (getData(key)) {
			tasks = getData(key); //if storage data is clear set default array
		} else {
			tasks = [
				{ id: random(), name: 'Viktor', age: '25' },
				{ id: random(), name: 'Olesya', age: '19' },
				{ id: random(), name: 'Nikita', age: '35' }
			];
		}
		setData(key, tasks);
	}

	//initializing tasks in DOM
	function initData() {
		tasks.forEach(function(elem, i, arr) {
			myTable.tBodies[0].innerHTML +=
				'<tr><td><p class="taskName">' +
				elem.name +
				'</p></td><td><p class="age">' +
				elem.age +
				'</p></td><td><button class="edit">edit</button><button class="save" task-id="' +
				elem.id +
				'">save</button><button class="delete" task-id="' +
				elem.id +
				'">delete</button></td></tr>';
		});
		itinButtons();
	}

	addNew.onclick = function() {
		var taskName = document.getElementById('newTaskName').value; //new properties in array
		var newAge = document.getElementById('newAge').value;
		var newId = random();

		tasks.push({
			//new object in array of tasks
			id: newId,
			name: taskName,
			age: newAge
		});

		document.getElementById('newTaskName').value = ''; // input lines are empty again
		document.getElementById('newAge').value = '';

		myTable.tBodies[0].innerHTML += //initializing new object in DOM
			'<tr><td><p class="taskName">' +
			taskName +
			'</p></td><td><p class="age">' +
			newAge +
			'</p></td><td><button class="edit">edit</button><button class="save" task-id="' +
			newId +
			'">save</button><button class="delete" task-id="' +
			newId +
			'">delete</button></td></tr>';
		setData(key, tasks);
		itinButtons();
	};

	function itinButtons() {
		// all buttons have their own functions
		saveButtons = document.getElementsByClassName('save');
		editButtons = document.getElementsByClassName('edit');
		deleteButtons = document.getElementsByClassName('delete');
		for (var i = 0; i < saveButtons.length; i++) {
			saveButtons[i].onclick = saveAction;
			editButtons[i].onclick = editAction;
			deleteButtons[i].onclick = deleteAction;
		}
	}

	function saveAction(event) {
		var row = event.target.parentElement.parentElement; //select parent row
		var name = row.querySelector('.taskName'); //select <p>  with name
		var age = row.querySelector('.age'); //select <p>  with age
		var saveButton = row.querySelector('.save'); //select save button
		var editButton = row.querySelector('.edit'); // select edit button
		var elemId = saveButton.getAttribute('task-id'); //select id of object in array
		name.removeAttribute('contenteditable');
		age.removeAttribute('contenteditable');
		name.style.backgroundColor = 'transparent';
		age.style.backgroundColor = 'transparent';
		saveButton.style.display = 'none'; // hide / show buttons save/edit
		editButton.style.display = 'inline-block';
		tasks.forEach(function(elem, i, arr) {
			//set new properties in object
			if (elem.id == elemId) {
				elem.name = name.innerHTML;
				elem.age = age.innerHTML;
			}
		});
		setData(key, tasks); // change localStorage
	}
	function editAction(event) {
		var row = event.target.parentElement.parentElement;
		var name = row.querySelector('.taskName');
		var age = row.querySelector('.age');
		var saveButton = row.querySelector('.save');
		var editButton = row.querySelector('.edit');
		name.setAttribute('contenteditable', 'true');
		age.setAttribute('contenteditable', 'true');
		name.style.backgroundColor = '#D0D09B';
		age.style.backgroundColor = '#D0D09B';
		saveButton.style.display = 'inline-block';
		editButton.style.display = 'none';
	}
	function deleteAction(event) {
		var row = event.target.parentElement.parentElement;
		var saveButton = row.querySelector('.save');
		var elemId = saveButton.getAttribute('task-id');

		tasks.forEach(function(elem, i, arr) {
			//remove object from array
			if (elem.id == elemId) {
				tasks.splice(i, 1);
			}
		});
		row.remove(); //remove row from DOM
		setData(key, tasks);

		if (getData(key).length < 1) {
			storage.clear(); //clear localStorage
		}
	}
});
