// content.js
window.addEventListener('load', () => {
  const button = document.createElement('button');
  button.innerText = 'Redirect';
  button.style.position = 'fixed';
  button.style.bottom = '10px';  // Moved to bottom
  button.style.left = '10px';    // Moved to left
  button.style.zIndex = '1000';
  button.style.padding = '10px 20px';
  button.style.backgroundColor = '#008CBA';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', () => {
    const data = {
      url: window.location.href,
      title: document.title
    };
    const queryString = new URLSearchParams(data).toString();
    const redirectUrl = `http://localhost:3000/?${queryString}`;
    window.location.href = redirectUrl;
  });

  document.body.appendChild(button);
});
