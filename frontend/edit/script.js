let lists = [[], [], [], [], []];
// I did use chatGPT to assist me with this.
let dictionaries = [{}, {}, {}];

var $ = function (id) {
  return document.getElementById(id);
}

function addToList(listIndex, isDictionary=false) {
  if (listIndex == 6) { // Specifically for WorkExperience
    let inputa = new Date(document.getElementById(`input${listIndex}a`).value);
    let inputb = new Date(document.getElementById(`input${listIndex}b`).value);
    let years = new Date(inputb-inputa).getFullYear() - 1970; 
    let months = (inputb.getMonth() - inputa.getMonth() + (12 * (inputb.getFullYear() - inputa.getFullYear())))-(years*12)
    let final = `${years} years`;
    if (months > 0) {final += `,${months} months`;}
    let key = document.getElementById(`key${listIndex}`).value;
    if (key === "") {
      alert("Please enter a key for the dictionary item.");
      return;
    }
    dictionaries[(listIndex-5) - 1][key] = final;
    displayDict(listIndex);
    return;
  }
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

function adddirecttolist(listIndex, value, key="", isDictionary=false) {
  if (isDictionary) {
    if (key === "") {
      alert("Please enter a key for the dictionary item.");
      return;
    }
    dictionaries[(listIndex-5) - 1][key] = value;
    displayDict(listIndex);
  } else {
    lists[listIndex - 1].push(value);
    displayList(listIndex);
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


// Education - 1
// Skills - 2
// Technical Skill - 3
// Language - 4
// Intrests - 5
// Work Experience - 6
// Personal Projects - 7
// Social Media - 8

const header_nav = document.querySelector('#header_nav');

async function getuserdata() {
    let cuser = getCookie("username");
    let cphash = getCookie("phash");
    const response = await fetch('/api/getuserdata', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username":cuser, "uhash":cphash})
    });
    const result = await response.json();
    return result;
}

async function main() {
    const result = await checkCookieLogin();
    if (result == false) {
        alert("Not authenticated");
        return
    }
    //Hide the signup/login buttons if the user is already logged in and instead display the logout button
    header_nav.innerHTML = "<ul><li><a href='/logout'>Logout</a></li><li><a href='/main'>Back</a></li></ul>";
    const udata = await getuserdata();


    $('fName').value = udata.data.firstName;
    $('lName').value = udata.data.LastName;
    $('pn').value = udata.data.phoneNumber;
    $('email').value = udata.data.Email;
    $('location').value = udata.data.Location;


    const order = {"Work Experience":6, "Education":1, "Technical Skills":3, "Skills":2, "Interests":5, "Personal Projects":7, "Languages":4, "Social Media":8};
    for (let item in order) {
        if (item in udata.data.odict) {
            let ndata = udata.data.odict[item];
            for (let x in ndata) {
              adddirecttolist(order[item], ndata[x], x, true);
            }
        } else if (item in udata.data.olist) {
            let ndata = udata.data.olist[item];
            for (let x in ndata) {
              adddirecttolist(order[item], ndata[x]);
            }
        } else {
            console.warn(item+" is not found in udata");
        }
    }
}

async function submitall() {
  data = {};
  data.firstName = $('fName').value;
  data.LastName = $('lName').value;
  data.phoneNumber=  $('pn').value;
  data.Email =  $('email').value;
  data.Location = $('location').value;
  data.odict = {};
  data.odict["Personal Projects"] = dictionaries[7-5-1];
  data.odict["Work Experience"] = dictionaries[6-5-1];
  data.odict["Social Media"] = dictionaries[8-5-1];
  data.olist = {};
  data.olist["Education"] = lists[1-1];
  data.olist["Skills"] = lists[2-1];
  data.olist["Technical Skills"] = lists[3-1];
  data.olist["Languages"] = lists[4-1];
  data.olist["Interests"] = lists[5-1];
  let cuser = getCookie("username");
  let cphash = getCookie("phash");
  const response = await fetch('/api/submituserdata', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username":cuser, "uhash":cphash, "data":data})
    });
    const result = await response.json();
    if (result.success) {
      location.href = '/main';
    } else {
      alert("Failed to submit");
    }
}

$('submitall').addEventListener("click", submitall);
main();