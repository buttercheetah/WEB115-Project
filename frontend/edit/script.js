let lists = [[], [], [], [], []];
// I did use chatGPT to assist me with this.
let dictionaries = [{}, {}, {}];

function addToList(listIndex, isDictionary=false) {
  let input = document.getElementById(`input${listIndex}`).value;
  if (input !== "") {
    if (isDictionary) {
      let key = document.getElementById(`key${listIndex}`).value;
      if (key === "") {
        alert("Please enter a key for the dictionary item.");
        return;
      }
      dictionaries[(listIndex-5) - 1][key] = input;
      displayDict(listIndex);
    } else {
      lists[listIndex - 1].push(input);
      displayList(listIndex);
    }
    
    document.getElementById(`input${listIndex}`).value = "";
    if (isDictionary) {
      document.getElementById(`key${listIndex}`).value = "";
    }
  }
}

function displayList(listIndex) {
    let list = lists[listIndex - 1];
    let listContainer = document.getElementById(`list${listIndex}`);
    listContainer.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let li = document.createElement("li");
      li.innerText = item;
      let editButton = document.createElement("span");
      editButton.innerText = "Edit";
      editButton.classList.add("edit");
      editButton.setAttribute("onclick", `editItemlist(${listIndex}, ${i})`);
      let deleteButton = document.createElement("span");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("delete");
      deleteButton.setAttribute("onclick", `deleteItemlist(${listIndex}, ${i})`);
      li.appendChild(document.createTextNode(" "));
      li.appendChild(editButton);
      li.appendChild(document.createTextNode(" "));
      li.appendChild(deleteButton);
      listContainer.appendChild(li);
    }
  }
  function displayDict(dictIndex) {
    let dict = dictionaries[(dictIndex-5)-1];
    let dictContainer = document.getElementById(`dict${dictIndex}`);
    dictContainer.innerHTML = "";
    for (let key in dict) {
      if (dict.hasOwnProperty(key)) {
        let value = dict[key];
        let li = document.createElement("li");
        li.innerText = `${key}: ${value}`;
        let editButton = document.createElement("span");
        editButton.innerText = "Edit";
        editButton.classList.add("edit");
        editButton.setAttribute("onclick", `editItemdict(${dictIndex}, "${key}")`);
        let deleteButton = document.createElement("span");
        deleteButton.innerText = "Delete";
        deleteButton.classList.add("delete");
        deleteButton.setAttribute("onclick", `deleteItemdict(${dictIndex}, "${key}")`);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(editButton);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(deleteButton);
        dictContainer.appendChild(li);
      }
    }
  }
  

function editItemlist(listIndex, itemIndex) {
  let list = lists[listIndex - 1];
  let item = list[itemIndex];
  let editedItem = prompt("Enter new text", item);
  if (editedItem !== null && editedItem !== "") {
    list[itemIndex] = editedItem;
    displayList(listIndex);
  }
}
function editItemdict(dictIndex, itemName) {
  let item = dictionaries[dictIndex-5-1][itemName];
  let editedItem = prompt("Enter new text", item);
  if (editedItem !== null && editedItem !== "") {
    dictionaries[dictIndex-5-1][itemName] = editedItem;
    displayDict(dictIndex);
  }
}


function deleteItemlist(listIndex, itemIndex) {
  let list = lists[listIndex - 1];
  list.splice(itemIndex, 1);
  displayList(listIndex);
}

function deleteItemdict(dictIndex, itemName) {
  delete dictionaries[dictIndex-5-1][itemName];
  displayDict(dictIndex);
}

displayList(1);
displayList(2);
displayList(3);
displayList(4);
displayList(5);
