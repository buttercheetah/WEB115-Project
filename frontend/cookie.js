function getCookie(name) {
const value = `; ${document.cookie}`;
const parts = value.split(`; ${name}=`);
if (parts.length === 2) return parts.pop().split(';').shift();
}
async function checkCookieLogin() {
    let cuser = getCookie("username");
    let cphash = getCookie("phash");
    if (cuser != "" && cphash != undefined) {
        const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username":cuser, "password":cphash})
        });
        const result = await response.json();
        console.log(result);
        if (result.success) { 
            console.log('Success login!');
            return true; 
        }
    }
}
