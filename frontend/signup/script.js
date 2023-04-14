const form = document.querySelector('#signup-form');
const message = document.querySelector('#message');

async function login_success() {
    //console.log('Success login function!');
    message.textContent = 'Already Logged in!';
    await sleep(400);
    location.href = '/main';
}


if (checkCookieLogin()) {
    login_success();
}

form.addEventListener('submit', async (event) => {
event.preventDefault();

const username = form.username.value;
const password = form.password.value;

const response = await fetch('/api/signup', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password})
});

const result = await response.json();

if (result.success) {
    message.textContent = 'Account created successfully';
    await sleep(400);
    location.href = '/login';
} else {
    message.textContent = result.message;
}
});