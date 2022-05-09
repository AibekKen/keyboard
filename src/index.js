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
let capsLock;
if (localStorage.capsLock) {
  capsLock = localStorage.capsLocks;
} else {
  capsLock = true;
}
createKButton(keyboardBody, capsLock);

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

textareaInput.addEventListener('click', () => {
  let { start, end } = getCursorPos(textareaInput);
  cursorPos = start;
  cursorEnd = end;
  if (cursorPos !== cursorEnd) {
    selected = true;
  } else {
    selected = false;
  }
  console.log(start, end);
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'CapsLock') {
    capsLock = e.getModifierState('CapsLock');
    localStorage.capsLock = capsLock;
    const letters = document.querySelectorAll('.keyboard-letter');
    letters.forEach((letter) => {
      let content = letter.textContent;
      letter.textContent = capsLock ? content.toUpperCase() : content.toLowerCase();
    });
  }
  if (cursorPos === cursorEnd) {
    textareaInput.setSelectionRange(cursorPos, cursorPos);
    textareaInput.focus();
    selected = false;
  }
  textareaInput.focus();
  document.querySelector('#' + e.code).classList.add('active');
  if (e.key.length < 3 || e.code === 'Enter') {
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
  if (e.code === 'ArrowUp' && cursorPos !== 0) {
    let { start, end } = getCursorPos(textareaInput);
    cursorPos = start;
    cursorEnd = end;
    selected = false;
  }
  if (e.code === 'ArrowDown' && textareaInput.value.length !== cursorPos) {
    let { start, end } = getCursorPos(textareaInput);
    cursorPos = start;
    cursorEnd = end;
    console.log(cursorPos, cursorEnd)
    selected = false;
  }
  document.querySelector('#' + e.code).classList.remove('active');
});

keyboardBody.addEventListener('mousedown', (e) => {
  let value = textareaInput.value;
  if (e.target.classList.contains('keyboard-button')) {
    let content = e.target.textContent;
    if (e.shiftKey && !e.getModifierState('CapsLock')) {
      content = content.toUpperCase();
    }
    if (e.shiftKey && e.getModifierState('CapsLock')) {
      content = content.toLowerCase();
    }
    e.target.classList.add('active');
    if (!e.target.classList.contains('special-btn')) {
      if (!selected) {
        textareaInput.value = value.length === cursorPos
          ? value + content
          : value.slice(0, cursorPos) + content + value.slice(cursorPos);
        cursorPos += 1;
      } else {
        textareaInput.value = value.slice(0, cursorPos) + content + value.slice(cursorEnd);
        selected = false;
        cursorPos += 1;
      }
    }
    if (e.target.classList.contains('Backspace')) {
      if (!selected) {
        if (cursorPos !== 0) {
          textareaInput.value = value.length === cursorPos
            ? value.slice(0, cursorPos - 1)
            : value.slice(0, cursorPos - 1) + value.slice(cursorPos);
          cursorPos -= 1;
        }
      } else {
        textareaInput.value = value.slice(0, cursorPos) + value.slice(cursorEnd);
        selected = false;
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
    if (e.target.classList.contains('CapsLock')) {
      capsLock = e.getModifierState('CapsLock');
      localStorage.capsLock = capsLock;
      const letters = document.querySelectorAll('.keyboard-letter');
      letters.forEach((letter) => {
        let content = letter.textContent;
        letter.textContent = capsLock ? content.toUpperCase() : content.toLowerCase();
      });
    }
    //! Выделение нужно доработать, когда уменшаешь область выделение
    if (e.target.classList.contains('ArrowLeft')) {
      if (!e.shiftKey) {
        cursorPos -= 1;
        if (cursorPos < 0) {
          cursorPos = 0;
        }
      } else {
        if (cursorEnd < cursorPos) {
          cursorEnd = cursorPos;
        }
        cursorPos -= 1;
        if (cursorPos < 0) {
          cursorPos = 0;
        }
        if (cursorPos !== cursorEnd) {
          selected = true;
        } else {
          selected = false;
        }
      }
    }
    if (e.target.classList.contains('ArrowRight')) {
      if (!e.shiftKey) {
        cursorPos += 1;
      } else {
        if (cursorEnd < cursorPos) {
          cursorEnd = cursorPos;
        }
        cursorEnd += 1;
        selected = true;
      }
    }
    if (e.target.classList.contains('Enter')) {
      textareaInput.value = value.length === cursorPos
        ? value + '\n'
        : value.slice(0, cursorPos) + '\n' + value.slice(cursorPos);
      cursorPos += 1;
    }
  }
  console.log(selected);
  console.log(cursorPos, cursorEnd);
});

document.addEventListener('mouseup', () => {
  setTimeout(() => {
    if (!selected) {
      textareaInput.setSelectionRange(cursorPos, cursorPos);
      textareaInput.focus();
      selected = false;
    }
    if (selected) {
      textareaInput.setSelectionRange(cursorPos, cursorEnd);
    }
    document.querySelectorAll('.keyboard-button').forEach(button => button.classList.remove('active'));
  }, 0);
});
