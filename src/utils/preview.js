function preview(event) {
  let preview = document.getElementById('preview');
  let element = event.target;
  if (element.parentNode.classList.contains('book')) {
    // For the case when the user has clicked a child element of a book
    // (e.g. the front cover or the spine), then take the parent node
    element = element.parentNode;
  }
  if (element.classList.contains('book')) {
    preview.innerHTML = element.outerHTML;
    preview.style.display = 'flex';
    element.classList.add('hide');
  }
}

export default preview;