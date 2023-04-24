const maindata = document.querySelector('#main');
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
        maindata.innerHTML = '<p>Not logged in!</p><p>Please log in.</p>';
        return;
    }
    //Hide the signup/login buttons if the user is already logged in and instead display the logout button
    header_nav.innerHTML = "<ul><li><a href='/logout'>Logout</a></li><li><a href='/edit'>Edit</a></li></ul>";
    const udata = await getuserdata();

    if (udata.success == false) {
        maindata.innerHTML = "<p>Notice</p><p>"+udata.message+"</p>";
        return;
    }
    htmltopush = "";

    htmltopush += "<h2>"+udata.data.firstName+" "+udata.data.LastName+"<br>"+udata.data.Email+"</h3>";
    htmltopush += "<h4>"+udata.data.Location+"<br>"+udata.data.phoneNumber+"</h4>";


    const order = ["Work Experience", "Education", "Technical Skills", "Skills", "Interests", "Personal Projects", "Languages", "Social Media"];
    for (let item in order) {
        if (order[item] in udata.data.odict) {
            let ndata = udata.data.odict[order[item]];
            htmltopush += "<div id='"+order[item]+"'>";
            htmltopush += "<h3>"+order[item]+"</h3>";
            htmltopush += "<p>";
            for (let x in ndata) {
                htmltopush += x+": "+ndata[x] + "<br>";
            }
            htmltopush += "</p></div>";
        } else if (order[item] in udata.data.olist) {
            let ndata = udata.data.olist[order[item]];
            htmltopush += "<div id='"+order[item]+"'>";
            htmltopush += "<h3>"+order[item]+"</h3>";
            htmltopush += "<p>";
            for (let x in ndata) {
                htmltopush += ndata[x] + "<br>";
            }
            htmltopush += "</p></div>";
        } else {
            console.warn(order[item]+" is not found in udata");
        }
    }
    maindata.innerHTML = htmltopush;
}

main();