function login() {
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;

    const data = {
        identifier: identifier,
        password: password
    };

    fetch('http://localhost:1337/api/auth/local/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        // Save JWT token to localStorage
        localStorage.setItem('token', data.jwt);
        // Redirect user to dashboard or any other authenticated page
        window.location.href = 'index.html';
    })
    .catch(error => {
        document.getElementById('message').innerText = 'Login failed. Please try again.';
        console.error('Error:', error);
    });
}
