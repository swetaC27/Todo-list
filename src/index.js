import _ from 'lodash';
import './style/style.css';

// let redooperations = [];


window.onload = () => {

    const taskString = document.getElementById("inputActionItem");// corresponds to the input task
    const tasks = document.getElementById("tasks"); //corresponds to the to-do task list
    const stackoperations = []; //to maintain all the operations performed
    const undooperations = []; //to maintain all undo operations performed

    let indexPosition = 0;

    function doc_keyUp(e) {
        // this would test for whichever key is 40 and the ctrl key at the same time
        if (e.ctrlKey && e.keyCode == 90) {
            // call your function to do the thing
            undoOperation();
        }
        if (e.ctrlKey && e.keyCode == 89) {
            // call your function to do the thing
            redoOperation();
        }
    }


    //this method will return the the list item to be added in the DOM
    function createActionItem(taskString) {

        const listItem = document.createElement("li");
        listItem.setAttribute('id', indexPosition);
        const checkBox = document.createElement("input");
        const label = document.createElement("label");
        const deletBtn = document.createElement("button");


        label.innerText = taskString;
        checkBox.type = "checkbox";
        checkBox.value = indexPosition;
        deletBtn.innerText = "Delete";
        deletBtn.className = "delete";

        listItem.appendChild(checkBox);
        listItem.appendChild(label);
        listItem.appendChild(deletBtn);

        return listItem;

    }


    //this method is responsible for creating the to-do task
    function addNewItem() {
        //if the input text is empty, do nothing
        if (taskString.value === "") {
            alert("Please enter an action item");
        }
        else {
            //call the create action item to create the to-do task
            const actionItem = createActionItem(taskString.value);
            //push the operation in the stack and maintain the state, index and element
            stackoperations.push({
                string: taskString.value,
                operation: "addNew",
                position: indexPosition,
                element: actionItem
            });
            indexPosition++;
            //append to the ul maintained
            tasks.appendChild(actionItem);
            //bind the action to be performed when the task is clicked
            bindEventListener(actionItem, actionPerformed);
            //clear the input text box
            taskString.value = "";
        }
        console.log(stackoperations);
    }

    // this method is responsible to bind an operation with each list element
    function bindEventListener(actionItem, checkboxEventHadler) {
        const checkbox = actionItem.querySelectorAll("input[type=checkbox]");
        const deleteBtn = actionItem.querySelector("button.delete");

        checkbox[0].onchange = checkboxEventHadler;
        deleteBtn.onclick = deleteActionItem;
    }

    //this method will delete the element and push the opeartion on to the stack
    var deleteActionItem = function () {

        const listItem = this.parentNode;
        const ul = listItem.parentNode;
        stackoperations.push({
            string: listItem.childNodes[1].innerText,
            operation: "delete",
            position: parseInt(listItem.childNodes[0].value),
            element: listItem
        });
        ul.removeChild(listItem);

    }


    //this method is responsible to set the task from to-do to complete and vice-versa
    var actionPerformed = function () {
        const self = this;

        const parentItem = this.parentNode;

        const currentIndex = parentItem.querySelector("input[type=checkbox]").value;
        const checkedValue = parentItem.querySelector("input[type=checkbox]").checked;

        if (checkedValue) {
            parentItem.querySelector("label").className = "tasksComplete";
        }
        else {
            parentItem.querySelector("label").className = "";
        }


        stackoperations.push({
            string: this.nextSibling.firstChild.nodeValue,
            operation: checkedValue ? "complete" : "todo",
            checkedState: checkedValue,
            position: parseInt(currentIndex),
            element: parentItem
        });

        console.log(stackoperations);

    }


    //Undo operation
    function undoOperation() {

        let latestOperation;

        let element;
        //Check if there are any operations present in the stack
        if (stackoperations.length > 0) {
            //pull the latest operation 
            latestOperation = stackoperations.pop();
            //maintain this so that redo will remember the operation
            undooperations.push(latestOperation);
            console.log(latestOperation, latestOperation.element.querySelector("input[type=checkbox]").checked);
        }


        if (latestOperation != undefined) {

            //if the operation performed was to mark it as a to-do item
            if (latestOperation.operation == "todo") {
                //we will perform the operation to mark the task complete
                //check the state of the checkbox, it will be false
                if (!latestOperation.checkedState) {
                    //set the checked state to true and strike off the element
                    latestOperation.element.querySelector("input[type=checkbox]").checked = true;
                    latestOperation.element.querySelector("label").className = "tasksComplete";

                }

            }
            //if the operation performed was to mark it as a complete item
            else if (latestOperation.operation == "complete") {
                //we will perform the operation to mark the task as to-do
                //check the state of the checkbox, it will be true
                if (latestOperation.checkedState) {
                    //set the checked state to false and remove the strike off style
                    latestOperation.element.querySelector("input[type=checkbox]").checked = false;
                    latestOperation.element.querySelector("label").className = "";

                }
            }
            //if the operation performed was to add a new item
            else if (latestOperation.operation == "addNew") {
                //we will fall back to the original state where the task was not present
                document.getElementById(latestOperation.position).outerHTML = "";
            }
            //if the operation performed was to delete an item
            else if (latestOperation.operation == "delete") {
                //we will fall back to the original state where the task was added
                element = latestOperation.element;
                if (tasks.children[latestOperation.position]) {
                    tasks.insertBefore(element, tasks.children[latestOperation.position])
                }
                else
                    tasks.append(element);

            }
        }
    }


    //Redo operation
    function redoOperation() {

        let latestOperation;

        let element;
        //check if the stack is empty or not
        if (undooperations.length > 0) {
            //pull the latest undo operation in order to perform redo
            latestOperation = undooperations.pop();
            //push the redone operation back to the main stack operations
            stackoperations.push(latestOperation);
        }

        if (latestOperation != undefined) {
            //if the action performed was to mark to-do,
            //perform operations to hide the strike off style and mark checkbox to unchecked
            if (latestOperation.operation == "todo") {
                latestOperation.element.querySelector("input[type=checkbox]").checked = latestOperation.checkedState;
                latestOperation.element.querySelector("label").className = "";
            }
            //if the action performed was to mark complete
            //perform operations to show the strike off style and mark checkbox to checked
            else if (latestOperation.operation == "complete") {
                latestOperation.element.querySelector("input[type=checkbox]").checked = latestOperation.checkedState;
                latestOperation.element.querySelector("label").className = "tasksComplete";
            }
            //if the action performed is to add new element
            else if (latestOperation.operation == "addNew") {
                //add new element in to the ul list at the same position from where it was removed
                element = latestOperation.element;
                if (document.getElementById(latestOperation.position)) {
                    document.getElementById(latestOperation.position).insertAdjacentHTML('afterend', element);
                }
                else
                    tasks.append(element);

            }
            //if the action performed is to add new element, hide the content from the DOM
            else if (latestOperation.operation == "delete") {
                document.getElementById(latestOperation.position).outerHTML = "";
            }
        }
    }



    const addItemBtn = document.getElementById("newItem"); //Add New Item
    const undoBtn = document.getElementById("undoOperation"); //Undo 
    const redoBtn = document.getElementById("redoOperation"); //Redo
    // register the handler
    addItemBtn.addEventListener("click", addNewItem); //Add new task
    undoBtn.addEventListener("click", undoOperation); //Undo Operation
    redoBtn.addEventListener("click", redoOperation); //Redo operation
    document.addEventListener('keyup', doc_keyUp, false); //to handle CtrlZ and CtrlY key events




}