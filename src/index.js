import { createKButton } from './assets/scripts/кeyboardButton';
import './assets/styles/style.scss';

const container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

const textareaWrapper = document.createElement('div');
textareaWrapper.className = 'textarea-wrapper';
container.appendChild(textareaWrapper);

const textareaInput = document.createElement('textarea');
textareaInput.className = 'textarea-input';
textareaInput.autofocus = true;
textareaWrapper.appendChild(textareaInput);

const keyboardBody = document.createElement('div');
keyboardBody.className = 'keyboard-body';
container.appendChild(keyboardBody);

createKButton(keyboardBody);
function getCursorPos(input) {
  let pos;
  let len;

  if ('selectionStart' in input && document.activeElement === input) {
    return {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  }
  if (input.createTextRange) {
    let sel = document.selection.createRange();
    if (sel.parentElement() === input) {
      let rng = input.createTextRange();
      rng.moveToBookmark(sel.getBookmark());
      for (len = 0;
        rng.compareEndPoints('EndToStart', rng) > 0;
        rng.moveEnd('character', -1)) {
        len += 1;
      }
      rng.setEndPoint('StartToStart', input.createTextRange());
      for (pos = { start: 0, end: len };
        rng.compareEndPoints('EndToStart', rng) > 0;
        rng.moveEnd('character', -1)) {
        pos.start += 1;
        pos.end += 1;
      }
      return pos;
    }
  }
  return -1;
}

let cursorPos = 0;

textareaWrapper.addEventListener('click', () => {
  cursorPos = getCursorPos(textareaInput).start;
});

/*
let selected = false;
textareaInput.addEventListener('select', () => {
  let { startPoint, endPoint } = getCursorPos(textareaInput);
  selected = true;
});
*/

document.addEventListener('keydown', (e) => {
  textareaInput.focus();
  document.querySelector('#' + e.code).classList.add('active');
  cursorPos += e.code === 'Backspace' ? -1 : +1;
  cursorPos = cursorPos < 0 ? 0 : cursorPos;
})


document.addEventListener('keyup', (e) => {
  document.querySelector('#' + e.code).classList.remove('active');
});

keyboardBody.addEventListener('mousedown', (e) => {
  textareaInput.focus();
  let value = textareaInput.value;
  if (e.target.classList.contains('keyboard-button')) {
    e.target.classList.add('active');
    if (!e.target.classList.contains('special-btn')) {
      textareaInput.value = value.length === cursorPos
        ? value + e.target.textContent
        : value.slice(0, cursorPos) + e.target.textContent + value.slice(cursorPos);
      cursorPos += 1;
    }
    if (e.target.classList.contains('Backspace')) {
      textareaInput.value = value.length === cursorPos
        ? value.slice(0, cursorPos - 1)
        : value.slice(0, cursorPos - 1) + value.slice(cursorPos)
      cursorPos -= 1;
    }
    if (e.target.classList.contains('Delete')) {
      if (value.length !== cursorPos) {
        textareaInput.value = value.slice(0, cursorPos) + value.slice(cursorPos + 1);
      }
    }
  }
});

keyboardBody.addEventListener('mouseup', (e) => {
  setTimeout(() => {
    if (e.target.classList.contains('keyboard-button')) {
      e.target.classList.remove('active');
    }
  }, 200);
});




