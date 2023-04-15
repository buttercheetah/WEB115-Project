let lists = [[], [], [], [], []];
// I did use chatGPT to assist me with this.
function addToList(listIndex) {
  let input = document.getElementById(`input${listIndex}`).value;
  if (input !== "") {
    lists[listIndex - 1].push(input);
    displayList(listIndex);
    document.getElementById(`input${listIndex}`).value = "";
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
      editButton.setAttribute("onclick", `editItem(${listIndex}, ${i})`);
      let deleteButton = document.createElement("span");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("delete");
      deleteButton.setAttribute("onclick", `deleteItem(${listIndex}, ${i})`);
      li.appendChild(document.createTextNode(" "));
      li.appendChild(editButton);
      li.appendChild(document.createTextNode(" "));
      li.appendChild(deleteButton);
      listContainer.appendChild(li);
    }
  }
  

function editItem(listIndex, itemIndex) {
  let list = lists[listIndex - 1];
  let item = list[itemIndex];
  let editedItem = prompt("Enter new text", item);
  if (editedItem !== null && editedItem !== "") {
    list[itemIndex] = editedItem;
    displayList(listIndex);
  }
}

function deleteItem(listIndex, itemIndex) {
  let list = lists[listIndex - 1];
  list.splice(itemIndex, 1);
  displayList(listIndex);
}

displayList(1);
displayList(2);
displayList(3);
displayList(4);
displayList(5);
