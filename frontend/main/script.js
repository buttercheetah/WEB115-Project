const message = document.querySelector('#message');
const header_nav = document.querySelector('#header_nav');

async function main() {
    const result = await checkCookieLogin();
    if (result == false) {
        message.innerHTML = '<p>Not logged in!</p><p>please log in.</p>';
        return
    }
    //Hide the signup/login buttons if the user is already logged in
    header_nav.innerHTML = "<ul></ul>";
    
}

main();