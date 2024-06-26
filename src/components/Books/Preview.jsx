import React, { useEffect, useCallback } from 'react';
import { PiArrowsClockwiseBold } from 'react-icons/pi';

function Preview() {
  function closePreview() {
    let preview = document.getElementById('preview');
    if (preview.childElementCount > 1) {
      const id = preview.firstChild.id;
      document.getElementById(id).classList.remove('hide');
    }
    if (preview.firstChild.id !== 'flip_book') {
      preview.removeChild(preview.firstChild);
    }
    //preview.style.display = 'none';
    preview.classList.remove('show');
  }

  function openBook() {
    let preview = document.getElementById('preview');
    let book = preview.firstChild;
    book.classList.add('open');
  }

  function closeBook() {
    let preview = document.getElementById('preview');
    let book = preview.firstChild;
    book.classList.remove('open');
  }

  const flipFrontCover = useCallback(() => {
    let preview = document.getElementById('preview');
    let book = preview.firstChild;
    
    // If the book was open, make sure to close it
    if (book.classList.contains('open')) {
      closeBook();
    } else {
      openBook();
    }
  }, []);

  const flipBook = useCallback(() => {
    let preview = document.getElementById('preview');
    let book = preview.firstChild;
    book.classList.toggle('flipped');

    // If the book was open, make sure to close it
    if (book.classList.contains('open')) {
      closeBook();
    }
  }, []);

  useEffect(() => {
    function handlePreviewEvent(event) {
      event.stopPropagation();

      let preview = document.getElementById('preview');
      
      // Close the preview when the user presses the escape key
      // or when they click off of the book
      if (event.type === 'keydown') {
        if (event.code === 'Escape') {
          let book = preview.firstChild;
          if (book.classList.contains('open')) {
            closeBook();
          } else {
            closePreview();
          }
        } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
          // Pressing the left/right arrow keys should flip the book over
          flipBook();
        } else if (event.code === 'Enter') {
          // Pressing the enter key should open/close the book
          flipFrontCover();
        }
      } else if (event.type === 'click') {
        const ignore = ['sign_in_out', 'flip_book', 'toggle_aside'];
        if (ignore.includes(event.target.id)) {
          // Ignore when the user clicks one of the other action buttons
          return;
        } else if (event.target.id === 'inside') {
          // Clicking on the inside of the front cover should close the book
          closeBook();
        } else if (preview.classList.contains('show')) {
          const descendent = (
            event.target.parentNode.parentNode.id === 'preview' ||
            event.target.parentNode.parentNode.parentNode.id === 'preview'
          );
    
          if (!descendent) {
            // Clicking off of the book should close the preview
            closePreview();
          } else if (event.target.classList.contains('front')) {
            // Clicking on the front cover should open the book
            openBook();
          }
        }
      }
    }
  
    window.addEventListener('keydown', handlePreviewEvent);
    window.addEventListener('click', handlePreviewEvent);
    
    return () => {
    // Clean up listeners on unmount
      window.removeEventListener('keydown', handlePreviewEvent);
      window.removeEventListener('click', handlePreviewEvent);
    };
  }, [flipBook, flipFrontCover]);

  return (
    <div id='preview'>
      <button id='flip_book' onClick={flipBook} title='Press this button or use the left/right arrow keys to flip this book over'>
        <PiArrowsClockwiseBold size='25px' />
      </button>
    </div>
  );
}

export default Preview;
