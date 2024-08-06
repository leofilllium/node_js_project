const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = registerForm.elements.username.value;
  const email = registerForm.elements.email.value;
  const password = registerForm.elements.password.value;

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    if (response.ok) {
      window.location.href = '/login.html';
    } else {
      alert('Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Error registering:', error);
  }
});