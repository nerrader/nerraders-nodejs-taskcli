// process.argv, remember that
"use strict";
const fs = require("fs");
let tasklist = [];
let nextID = 0;

try {
	tasklist = JSON.parse(fs.readFileSync("taskcli.json", "utf8"));
	if (tasklist.length == 0) {
		nextID = 0;
	} else {
		nextID = Math.max(...tasklist.map((task) => task.id)) + 1;
	}
} catch (e) {
	if (e.code == "ENOENT") {
		console.log("It seems like it is your first time using this program");
	} else {
		console.log("Oops! Something went wrong when reading the file data");
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
function targetIDCheck() {
	switch (process.argv[3]) {
		case isNaN:
			console.log("The argument you put in as an ID is not a number");
			break;
		case Number(process.argv[3]) >= nextID:
			console.log("The number you put in is not a valid ID");
			break;
		case "*":
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
	case "add":
		const newTask = new Task(process.argv[3]);
		tasklist.push(newTask);
		nextID++;
		console.log("New task succesfully added!");
		listTasks();
		break;
	case "remove":
		const targetIDRemove = targetIDCheck();
		tasklist = tasklist.filter((task) => task.id != targetIDRemove);
		console.log(`Task ID ${targetIDRemove} has been successfully removed!`);
		listTasks();
		break;
	case "mark":
		const targetIDMark = targetIDCheck();
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
	case "update":
		const targetIDUpdate = targetIDCheck();
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
	case "clear":
		tasklist = [];
		nextID = 0;
		console.log("Tasklist cleared");
		break;
	default:
		console.log(
			`"${process.argv[2]}" is not a valid command, the following are: "add", "remove", "mark", "update", "list", "clear"`
		);
}

let data = JSON.stringify(tasklist, null, 4);
fs.writeFileSync("taskcli.json", data);
// node taskcli.js
