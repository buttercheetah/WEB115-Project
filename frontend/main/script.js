const message = document.querySelector('#message');
const header_nav = document.querySelector('#header_nav');

async function checklogin() {
    const result = await checkCookieLogin();
    if (result == false) {
        return false;
    } else {
        return true;
    }
}

async function main() {
    const result = await checklogin();
    if (result == false) {
        message.innerHTML = '<p>Not logged in!</p><p>please log in.</p>';
        return
    }
    header_nav.innerHTML = "<ul></ul>";
}

main();