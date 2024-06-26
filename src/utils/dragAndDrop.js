import { fireEvent } from '@testing-library/react';

function drag(event) {
  if (event.target.nodeName !== '#text') {
    let element = event.target;
    if (element.id === '') {
      element = element.parentNode;
    }
    if (element.classList.contains('book')) {
      // Save the id of the element we are dragging for use later in the
      // drop function (either addToStack or removeFromStack)
      event.dataTransfer.setData('id', element.id);
    }
  }
}

function allowDrop(event) {
  // Prevent the default behaviour which is to not allow dropping an element
  event.preventDefault();
}

function addToStack(event) {
  event.preventDefault();
  // Retrieve the id of the book being dropped
  let id = event.dataTransfer.getData('id');
  let original = document.getElementById(id);

  let element = original;
  let custom = original.parentNode.classList.contains('custom');
  if (!custom) {
    // Create a copy of the book to add to the stack instead of the book itself
    element = original.cloneNode(true);
  }

  // Update the text displayed when hovering over the book
  element.setAttribute('title', 'Double click to preview the book or drag and drop the book back onto the shelves on the left');

  if (element !== null && original.parentNode.id !== 'preview') {
    if (element.id.includes(':')) {
      // Update the id with the current time
      element.id = element.id.split(':')[0] + ':' + Date.now();
    } else {
      // Add the current time on the end of the id to ensure uniqueness
      element.id += ':' + Date.now();
    }

    // Randomly offset each book in the stack
    let width = element.style.getPropertyValue('--width').replace('px', '');
    let maxOffset = Math.max(10, 308 - width);
    element.style.left = (maxOffset * Math.random())+'px';
    // Unset the z-index so that the books render in the correct order
    element.style.zIndex = null;

    // Hide the original book on the shelf, but don't remove it so that
    // we can show it again later if we need to
    original.classList.add('hide');
    // Unhide the copy incase the book was dragged from the preview
    // in which case the original book on the shelf was already hidden
    element.classList.remove('hide');

    // The target is the element on which the book is being dropped
    let target = event.target;
    let aside = document.getElementById('aside');
    if (target.id === 'aside') {
      // If the target is the aside, add the book to the top of the stack
      target.appendChild(element);
    } else if (target.id === 'spacer') {
      // If the target is the spacer, add the book to the bottom of the stack
      aside.insertBefore(element, target.nextSibling);
    } else {
      if (!target.classList.contains('book')) {
        // The target may be one of the children of the book div
        // so we want to update the target to be the parent
        target = target.parentNode;
      }
      if (target.classList.contains('book')) {
        // Insert the book in the stack above the target
        aside.insertBefore(element, target.nextSibling);
      } else {
        // Unhide the original if we can't add the book to the stack
        original.classList.remove('hide');
      }
    }
  }

  if (custom) {
    // Move books up when a book is removed
    // Fire a resize event to cause the books on the shelves to rerender
    fireEvent.resize(window);
  }
}

function removeFromStack(event) {
  event.preventDefault();
  // Retrieve the id of the book being dropped
  let id = event.dataTransfer.getData('id');
  let element = document.getElementById(id);

  let custom = (event.target.classList.contains('custom')
    || event.target.parentNode.classList.contains('custom')
    || event.target.parentNode.parentNode.classList.contains('custom'));

  if (element !== null && custom) {
    if (element.id.includes(':')) {
      // Update the id with the current time
      element.id = element.id.split(':')[0] + ':' + Date.now();
    }

    // Unset the position
    element.style.left = null;

    // Update the text displayed when hovering over the book
    element.setAttribute('title', 'Double click to preview the book or drag and drop to rearrange books');

    // Unhide the copy incase the book was dragged from the preview
    // in which case the original book on the shelf was already hidden
    element.classList.remove('hide');
    element.classList.remove('leaning');

    // The target is the element on which the book is being dropped
    let target = event.target;
    if (target.nodeName === 'SECTION') {
      // If the target is the aside, add the book to the top of the stack
      target.appendChild(element);
    } else {
      if (!target.classList.contains('book')) {
        // The target may be one of the children of the book div
        // so we want to update the target to be the parent
        target = target.parentNode;
      }
      if (target.classList.contains('book')) {
        // Insert the book in the stack above the target
        target.parentNode.insertBefore(element, target);
      }
    }
    
    // Fire a resize event to cause the books on the shelves to rerender
    fireEvent.resize(window);
  } else if (element !== null) {
    if (element.id.includes(':')) {
      // Retrieve the id of the original book on the shelf
      // by removing the timestamp we added for uniqueness
      let id = element.id.split(':')[0];

      // Unhide the original book
      document.getElementById(id).classList.remove('hide');

      // Remove the copy of the book from the stack
      element.parentNode.removeChild(element);
    }
  }
}

export { drag, allowDrop, addToStack, removeFromStack };