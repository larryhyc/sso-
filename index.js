

function sainup () {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(username);
    console.log(password);

    fetch('http://127.0.0.1:3001/sainup', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(res => res.json())
        .then(msg => {
            console.log(msg);
            alert(msg.msg);
        });
}

function login () {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(username);
    console.log(password);

    fetch('http://127.0.0.1:3001/login', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(res => res.json())
        .then(msg => {
            console.log(msg);
            alert(msg.msg);
        });
}