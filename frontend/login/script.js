const form = document.querySelector('#login-form');
const message = document.querySelector('#message');


async function login_success() {
    console.log('Success login function!');
    message.textContent = 'Login Successfull!';
    await sleep(400);
    location.href = '/main';
}

async function checklogin() {
    const result = await checkCookieLogin();
    if (result == false) {
        return false;
    } else {
        login_success();
    }
}
checklogin();

form.addEventListener('submit', async (event) => {
event.preventDefault();

const username = form.username.value;
const password = form.password.value;

const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password})
});

const result = await response.json();

if (result.success) {
    document.cookie = "username="+username+"; path=/";
    document.cookie = "phash="+result.phash+"; path=/";
    login_success();
} else {
    message.textContent = 'Invalid username or password';
}
});