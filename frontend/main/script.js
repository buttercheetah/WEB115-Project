const message = document.querySelector('#message');

async function checklogin() {
    const result = await checkCookieLogin();
    if (result == false) {
        console.log("Not logged in");
        message.innerHTML = '<p>Not logged in!</p><p>please log in.</p>';
        return false;
    } else {
        return true;
    }
}

async function main() {
    const result = await checklogin();
    
}