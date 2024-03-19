function registerUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        email: email,
        password: password
    };

    fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('message').innerText = 'User registered successfully!';
        } else {
            document.getElementById('message').innerText = 'Registration failed. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
