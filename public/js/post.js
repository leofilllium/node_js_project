const postForm = document.getElementById('post-form');

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(postForm);
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/posts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      window.location.href = '/';
    } else {
      alert('Failed to create post. Please try again.');
    }
  } catch (error) {
    console.error('Error creating post:', error);
  }
});