function deletecookie(cookie) {
    console.log('Deleting cookie ' + cookie);
    document.cookie = cookie+'=; Max-Age=-99999999; path=/';
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return undefined;
}
async function checkCookieLogin() {
    let cuser = getCookie("username");
    let cphash = getCookie("phash");
    console.log(cuser);
    console.log(cphash);
    if (cuser != undefined && cphash != undefined) {
        const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username":cuser, "password":cphash})
        });
        const result = await response.json();
        //console.log(result);
        if (result.success) { 
            //console.log('Success login!');
            return true; 
        } else {
            deletecookie("username");
            deletecookie("phash");
        }
    }
    return false;
}
