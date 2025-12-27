# TaskCLI / Task Tracker
https://roadmap.sh/projects/task-tracker

## Description
This is a simple task tracker tool made in Javascript that allows you, the user, to add, delete, update, list, and mark tasks easily.

## Installation
This tool requires NodeJS v8.0+ for it to work. You can use the node -v command in the command prompt to check the version installed
This is a pretty simple tool so it doesn't require installation, just download the python script, go to command prompt and navigate to the folder you downloaded the script in `eg: C:\Users\User\GitHubDownloads`

After that, you can start using the tracker in the command prompt.

## Usage
As said before, you must navigate to the folder that you downloaded the python file in the command prompt to start typing in commands.
### Adding a Task
**To add a task, type in:**
`node taskcli.js add`
> Example: `node taskcli.js add shopping`
Note that each time you want to type in a command, it always starts with "node taskcli.js"
Also if your task has spaces in them, use quotation marks "" to type them in
> Example `node taskcli.js add "play ultrakill"`

It will then show you that the task has been created, as well as the created task's ID and status, and the current tasklist.

**NOTE:**

> When doing future operations with tasks after you have created it such as deleting, updating, or marking the task, refer to its ID rather than the name/description of the task.

### Deleting a task
**To delete a task, type in:**
`node taskcli.js delete {task-id}`
> Example: `node taskcli.js delete 3`

This will then show you that the task with that ID has been deleted, as well as the current tasklist.

### Updating a task's name
**To update a task, type in:**
`node taskcli.js update {task-id} "{updated-name}"`
> Example: `node taskcli.js update 1 "beat the devourer of gods"`

This will update the task's description and show the updated tasklist.

### Marking a task as todo/in-progress/done
**To mark a task as todo/in-progress/done, type this:**
`node taskcli.js mark {task-id} {todo/in-progress/done}`
> Example: `node taskcli.js mark 4 in-progress`

This will update the status of that task's ID to either todo/in-progress/done depending on what you typed in, and will also show the updated tasklist.

**NOTE:**

**You can put the task-id as "*" to mark every task as todo/in-progress/done:**

> **Example: `node taskcli.js mark * done`**

### Listing the tasklist
**To list the tasklist, type in:**
`node taskcli.js list`

This will show every task regardless of status.

Additionally, you can put in todo/in-progress/done to list every task that has that particular status.
> Example: `node taskcli.js list in-progress`

This will show every task that has the status of "in-progress"
### Clearing the tasklist
**To clear the tasklist, type in:**
`tasklist clear`

This will clear every task in the tasklist.
