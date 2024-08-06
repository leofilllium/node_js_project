fetch('/posts')
  .then(response => response.json())
  .then(posts => {
    const postGrid = document.querySelector('.post-grid');

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');

      const imageElement = document.createElement('img');
      imageElement.src = post.imageUrl;
      imageElement.alt = post.title;

      const titleElement = document.createElement('h3');
      titleElement.textContent = post.title;

      const userElement = document.createElement('p');
      userElement.textContent = `Posted by: ${post.username}`;

      const postOverlay = document.createElement('div');
      postOverlay.classList.add('post-overlay');
      postOverlay.appendChild(titleElement);
      postOverlay.appendChild(userElement);

      postElement.appendChild(imageElement);
      postElement.appendChild(postOverlay);

      postGrid.appendChild(postElement);
    });
  })
  .catch(error => console.error('Error fetching posts:', error));