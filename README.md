# Hackthors TO-DO application with Undo and Redo functionality 

This project contains TO-DO application with Undo and Redo functionality in javascript with webpack.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes.

### Prerequisites

To run this algorithms you need any browser installed on your system i.e. internet explorer,firefox mozilla, safari. 

### How to use

Download package and extract needed.

After extracting just go to extracted folder you will find all files.

you will find follwing files 

```
-	dist
-	src
-	package-lock.json
- 	package.json
-	webpack.config.js
-	README.md
```

Complete logic for undo and redo is stored in index.js file in src forlder.

And index.html file is stored in dist folder with main.js, main.js file is generated when you run project on your machine and create final main.js from src index.js file.

# stack creation logic

```
	function addNewItem() {
		if (taskString.value === "") {
			alert("Please enter an action item");
		}
		else {
			const actionItem = createActionItem(taskString.value);
			stackoperations.push({
				string: taskString.value,
				operation: "addNew",
				position: indexPosition,
				element: actionItem
			});
			indexPosition++;
			tasks.appendChild(actionItem);
			bindEventListener(actionItem, actionPerformed);
			taskString.value = "";
		}
		console.log(stackoperations);
	}

			
```

Above code check the value of to do task added and stores that value to stackoperations object which contains string of task and operation and position of the element in the main stack and html strucutre of the list.

# undo and redo logic

```
	function undoOperation() {

		let latestOperation;
	
		let element;
		if (stackoperations.length > 0) {
			latestOperation = stackoperations.pop();
			undooperations.push(latestOperation);
			console.log(latestOperation, latestOperation.element.querySelector("input[type=checkbox]").checked);
		}
	
	
		if (latestOperation != undefined) {
			if (latestOperation.operation == "todo") {
				if (!latestOperation.checkedState) {
					latestOperation.element.querySelector("input[type=checkbox]").checked = true;
					latestOperation.element.querySelector("label").className = "tasksComplete";
		
				}
		
			}
			else if (latestOperation.operation == "complete") {
		
				if (latestOperation.checkedState) {
					latestOperation.element.querySelector("input[type=checkbox]").checked = false;
					latestOperation.element.querySelector("label").className = "";
		
				}
		
		
			}
			else if (latestOperation.operation == "addNew") {
				document.getElementById(latestOperation.position).outerHTML = "";
				//tasks.childNodes[latestOperation.position].parentNode.removeChild(tasks.childNodes[latestOperation.position]);
		
			}
			else if (latestOperation.operation == "delete") {
				element = latestOperation.element;
				if (tasks.children[latestOperation.position]) {
					tasks.insertBefore(element, tasks.children[latestOperation.position])
				}
				else
					tasks.append(element);
		
			}
		}
	}
	
	
	
	
	function redoOperation() {
	
		let latestOperation;
	
		let element;
		if (undooperations.length > 0) {
			latestOperation = undooperations.pop();
			stackoperations.push(latestOperation);
		}
	
		//console.log(latestOperation, latestOperation.element.querySelector("input[type=checkbox]").checked);
		if (latestOperation != undefined) {
		
			if (latestOperation.operation == "todo") {
				//if (!latestOperation.checkedState){
				latestOperation.element.querySelector("input[type=checkbox]").checked = latestOperation.checkedState;
				latestOperation.element.querySelector("label").className = "";
		
				// }
		
			}
			else if (latestOperation.operation == "complete") {
				latestOperation.element.querySelector("input[type=checkbox]").checked = latestOperation.checkedState;
				latestOperation.element.querySelector("label").className = "tasksComplete";
				// if (!latestOperation.checkedState){
		
		
				// }
		
			}
			else if (latestOperation.operation == "addNew") {
		
				element = latestOperation.element;
				//if (tasks.children[latestOperation.position]) {
				if (document.getElementById(latestOperation.position)) {
					document.getElementById(latestOperation.position).insertAdjacentHTML('afterend', element);
					//tasks.insertBefore(element, tasks.children[latestOperation.position])
				}
				else
					tasks.append(element);
		
			}
			else if (latestOperation.operation == "delete") {
				document.getElementById(latestOperation.position).outerHTML = "";
				//document.getElementById(latestOperation.position).parentNode.removeChild(element);
				//tasks.childNodes[latestOperation.position].parentNode.removeChild(tasks.childNodes[latestOperation.position]);
			}
		}
	}
			
```

Above logic just follows the stack operation object and according to operation it shuffles the values between stackoperation and redostack object to perform.


## How to run

To execute both the programs just open index.html file from dist folder and run in browser.

It will ask you for to add tasks just add number of tasks and perform redo and undo operations on it.

## Built With

* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - JavaScript (JS) is a lightweight interpreted or JIT-compiled programming language

* [Webpack](https://webpack.js.org/guides/getting-started/#basic-setup) - At its core, webpack is a static module bundler for modern JavaScript applications. 

## Versioning

We use [github](https://github.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/neu-mis-info6150-fall-2018/assignment-3-javascript-prathamesh-tambe). 

## Authors

**Sweta Chowdhury**

**Prathamesh Tambe**

## Acknowledgement

Used this link to understand the html and css elements - [w3scholls.com](https://w3schools.com)

To understand the webpack used following link - [webpack.js.org](https://webpack.js.org/guides/getting-started/#basic-setup)
