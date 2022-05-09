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

function setCaretPosition(input, start, end) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(start, end);
  } else if (input.createTextRange) {
    let range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', end);
    range.moveStart('character', start);
    range.select();
  }
}

let cursorPos = 0;
let cursorEnd = 0;
let selected = false;

textareaWrapper.addEventListener('click', () => {
  let { start, end } = getCursorPos(textareaInput);
  cursorPos = start;
  cursorEnd = end;
  console.log(cursorPos, end)
  selected = false;
});

textareaInput.addEventListener('select', () => {
  let { start, end } = getCursorPos(textareaInput);
  cursorPos = start;
  cursorEnd = end;
  selected = true;
});

document.addEventListener('keydown', (e) => {
  document.querySelector('#' + e.code).classList.add('active');
  if (e.key.length < 2) {
    textareaInput.setSelectionRange(cursorPos, cursorPos);
    textareaInput.focus();
    cursorPos += 1;
  }
  if (e.code === 'Backspace' || e.code === 'ArrowLeft') {
    cursorPos -= 1;
    cursorPos = cursorPos < 0 ? 0 : cursorPos;
  }
  if (e.code === 'ArrowRight' && cursorPos !== textareaInput.value.length) {
    cursorPos += 1;

  }

  console.log(cursorPos);
});

document.addEventListener('keyup', (e) => {
  document.querySelector('#' + e.code).classList.remove('active');
});

keyboardBody.addEventListener('mousedown', (e) => {
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
      if (cursorPos !== 0) {
        if (!selected) {
          textareaInput.value = value.length === cursorPos
            ? value.slice(0, cursorPos - 1)
            : value.slice(0, cursorPos - 1) + value.slice(cursorPos)
          cursorPos -= 1;
        } else {
          textareaInput.value = value.slice(0, cursorPos) + value.slice(cursorEnd);
          selected = false;
        }
      }
    }
    if (e.target.classList.contains('Delete')) {
      if (!selected) {
        if (value.length !== cursorPos) {
          textareaInput.value = value.slice(0, cursorPos) + value.slice(cursorPos + 1);
        }
      } else {
        textareaInput.value = value.slice(0, cursorPos) + value.slice(cursorEnd);
        selected = false;
      }
    }
    if (e.target.classList.contains('ArrowLeft')) {
      cursorPos -= 1;
    }
    if (e.target.classList.contains('ArrowRight')) {
      cursorPos += 1;
    }
  }
  console.log(cursorPos);
});

document.addEventListener('mouseup', () => {
  setTimeout(() => {
    textareaInput.setSelectionRange(cursorPos, cursorPos);
    textareaInput.focus();
    document.querySelectorAll('.keyboard-button').forEach(button => button.classList.remove('active'));
  }, 200);
});




