"use strict";
const fs = require("fs");
let tasklist = [];
let nextID = 0;

// reading the save file "taskcli.json"
try {
	tasklist = JSON.parse(fs.readFileSync("taskcli.json", "utf8"));
	// to figure out nextID
	if (tasklist.length == 0) {
		nextID = 0;
	} else {
		nextID = Math.max(...tasklist.map((task) => task.id)) + 1;
	}
} catch (e) {
	if (e.code == "ENOENT") {
		// error you get if file not found, aka taskcli.json doesnt exist aka its their first time using
		console.log("It seems like it is your first time using this program");
	} else {
		console.log(
			"Oops! Something went wrong when reading the file data, reseting tasklist"
		);
		tasklist = [];
		print(e);
	}
}

class Task {
	constructor(name) {
		this.name = name;
		this.status = "todo";
		this.id = nextID;
		this.createdAt = getFormattedDate();
		this.updatedAt = getFormattedDate();
	}
	updateStatus(newStatus) {
		this.status = newStatus;
		this.updatedAt = getFormattedDate();
	}
	updateName(newName) {
		this.name = newName;
		this.updatedAt = getFormattedDate();
	}
}
function listTasks(list = tasklist) {
	if (list.length == 0) {
		console.log("There is nothing in the tasklist");
		return;
	}
	console.log("Tasklist: ");
	list.map((task) =>
		console.log(
			`- ${task.name} | ${task.status} | Created At: ${task.createdAt} | Updated At: ${task.updatedAt} | [ID: ${task.id}] `
		)
	);
}
if (!process.argv[2]) {
	console.log(
		'Please provide a command ("add", "delete", "mark", "update", "list", "clear")'
	);
	process.exit(0);
}
// for commands delete, update, mark
function targetIDCheck(targetID) {
	switch (true) {
		case isNaN(targetID):
			console.log("The argument you put in as an ID is not a number");
			process.exit(1);
		case Number(targetID) >= nextID:
		case !tasklist.some((task) => task.id == targetID):
			console.log("The number you put in is not a valid ID");
			process.exit(1);
		case targetID === "*":
			return "*";
		default:
			return Number(process.argv[3]);
	}
}
function getFormattedDate() {
	const format = (num) => String(num).padStart(2, "0");
	const now = new Date();
	const date = now.getDate();
	const month = now.getMonth() + 1;
	const year = now.getFullYear();
	const hours = format(now.getHours());
	const minutes = format(now.getMinutes());
	const seconds = format(now.getSeconds());
	return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
const supportedStatuses = ["todo", "in-progress", "done"];
switch (process.argv[2].toLowerCase()) {
	// node taskcli.js add "play ultrakill"
	case "add":
		const taskName = process.argv[3];
		if (!taskName) {
			console.log("Please provide a taskname");
			break;
		}
		const newTask = new Task(taskName);
		tasklist.push(newTask);
		nextID++;
		console.log("New task successfully added!");
		listTasks();
		break;
	// node taskcli.js delete 0
	case "delete":
		const targetIDDelete = targetIDCheck(process.argv[3]);
		tasklist = tasklist.filter((task) => task.id != targetIDDelete);
		console.log(`Task ID ${targetIDDelete} has been successfully deleted!`);
		listTasks();
		break;
	// node taskcli.js mark 0 in-progress
	case "mark":
		const targetIDMark = targetIDCheck(process.argv[3]);
		const newStatus = process.argv[4].toLowerCase();
		if (!supportedStatuses.includes(newStatus)) {
			console.log(
				`"{${newStatus}}" is an invalid status, use the following instead: "todo", "in-progress", "done"`
			);
			break;
		} else if (targetIDMark == "*") {
			tasklist.forEach((task) => {
				task.status = newStatus;
				task.updatedAt = getFormattedDate();
			});
			console.log(
				`Successfully updated every tasks' status to ${newStatus}`
			);
			listTasks();
			break;
		}
		for (const task of tasklist) {
			if (task.id == targetIDMark) {
				task.status = newStatus;
				task.updatedAt = getFormattedDate();
				console.log(
					`Task ID ${targetIDMark} successfully updated status to ${newStatus}`
				);
				listTasks();
				break;
			}
		}
		console.log(`Task with ID ${targetIDMark} does not exist.`);
		break;
	// node taskcli.js update 0 "beat the devourer of gods"
	case "update":
		const targetIDUpdate = targetIDCheck(process.argv[3]);
		const newName = process.argv[4];
		if (targetIDUpdate == "*") {
			tasklist.forEach((task) => {
				task.name = newName;
				task.updatedAt = getFormattedDate();
			});
			console.log(`Successfully updated every tasks' name to ${newName}`);
			listTasks();
			break;
		}
		for (const task of tasklist) {
			if (task.id == targetIDUpdate) {
				task.name = newName;
				task.updatedAt = getFormattedDate();
				console.log(
					`Task ID ${targetIDUpdate} successfully updated name to ${newName}`
				);
				listTasks();
				break;
			}
		}
		break;
	// node taskcli.js list in-progress
	case "list":
		if (supportedStatuses.includes(process.argv[3])) {
			const filteredTasklist = tasklist.filter(
				(task) => task.status == process.argv[3]
			);
			listTasks(filteredTasklist);
		} else if (process.argv[3] == undefined) {
			listTasks();
		} else {
			console.log(
				`"${process.argv[3]}" is not a valid argument, the following are: "todo", "in-progress", "done"`
			);
		}
		break;
	// node taskcli.js clear
	case "clear":
		tasklist = [];
		nextID = 0;
		console.log("Tasklist cleared");
		break;
	// if not a valid command
	default:
		console.log(
			`"${process.argv[2]}" is not a valid command, the following are: "add", "delete", "mark", "update", "list", "clear"`
		);
}

let data = JSON.stringify(tasklist, null, 4);
fs.writeFileSync("taskcli.json", data);
