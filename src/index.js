import { createKButton, KeyboardButtonsArr } from './assets/scripts/кeyboardButton';
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
if (localStorage.capsLock !== undefined) {
  capsLock = localStorage.capsLocks;
} else {
  capsLock = false;
}

const description = document.createElement('div');
description.innerHTML = `<p class='description'>Операционная система: Windows</p><p class='description'>Переключение языка: CTRL+ALT</p>`
container.appendChild(description);

createKButton(keyboardBody);

let lang;
if (localStorage.lang) {
  lang = 'en';
} else {
  lang = localStorage.getItem('lang');
}

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

let buttons = document.querySelectorAll('.keyboard-button');
let cursorPos = 0;
let cursorEnd = 0;
let selected = false;
let shiftMode = false;

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

document.addEventListener('DOMContentLoaded', () => {
  lang = localStorage.getItem('lang');
  if (lang === 'ru') {
    buttons.forEach((el, i) => {
      if (KeyboardButtonsArr[i].keyRu !== undefined) {
        buttons[i].textContent = KeyboardButtonsArr[i].keyRu;
      }
    });
  }
});

document.addEventListener('keydown', (e) => {
  lang = localStorage.getItem('lang')
  console.log(lang)
  if (/[а-яёЧЯ.* +?^ ${}() | [\]\\]/i.test(e.key)) {
    console.log(selected);
    e.preventDefault();
    let content = document.querySelector('#' + e.code).textContent;
    let value = textareaInput.value;
    if (e.shiftKey && !e.getModifierState('CapsLock')) {
      content = content.toUpperCase();
    }
    if (e.shiftKey && e.getModifierState('CapsLock')) {
      content = content.toLowerCase();
    }
    if (!selected) {
      textareaInput.value = value.length === cursorPos
        ? value + content
        : value.slice(0, cursorPos) + content + value.slice(cursorPos);
    } else {
      textareaInput.value = value.slice(0, cursorPos) + content + value.slice(cursorEnd);
      selected = false;
    }
  }
  if (lang === 'ru') {
    KeyboardButtonsArr.forEach((k, i) => {
      if (k.keyRu) {
        if (k.key === e.key.toLowerCase()) {
          e.preventDefault();

          let value = textareaInput.value;
          let content = buttons[i].textContent;
          if (e.shiftKey && !e.getModifierState('CapsLock')) {
            content = content.toUpperCase();
          }
          if (e.shiftKey && e.getModifierState('CapsLock')) {
            content = content.toLowerCase();
          }
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
      }
    });
  }
  if (e.ctrlKey && e.altKey) {
    if (lang === 'en') {
      lang = 'ru';
      localStorage.setItem('lang', lang);
      buttons.forEach((el, i) => {
        if (KeyboardButtonsArr[i].keyRu !== undefined) {
          buttons[i].textContent = KeyboardButtonsArr[i].keyRu;
        }
      });
    } else {
      lang = 'en';
      localStorage.setItem('lang', lang);
      buttons.forEach((el, i) => {
        if (KeyboardButtonsArr[i].keyRu !== undefined) {
          buttons[i].textContent = KeyboardButtonsArr[i].key;
        }
      });
    }
  }
  if (shiftMode) {
    if (lang === 'ru') {
      KeyboardButtonsArr.forEach((k) => {
        if (k.shiftKey) {
          if (k.key === e.key && !k.keyRu) {
            e.preventDefault();
            let value = textareaInput.value;
            if (!selected) {
              textareaInput.value = value.length === cursorPos
                ? value + k.shiftKey
                : value.slice(0, cursorPos) + k.shiftKey + value.slice(cursorPos);
              cursorPos += 1;
            } else {
              textareaInput.value = value.slice(0, cursorPos) + k.shiftKey + value.slice(cursorEnd);
              selected = false;
              cursorPos += 1;
            }
          }
        }
      });
    } else {
      KeyboardButtonsArr.forEach((k) => {
        if (k.shiftKey) {
          if (k.key === e.key) {
            e.preventDefault();
            let value = textareaInput.value;
            if (!selected) {
              textareaInput.value = value.length === cursorPos
                ? value + k.shiftKey
                : value.slice(0, cursorPos) + k.shiftKey + value.slice(cursorPos);
              cursorPos += 1;
            } else {
              textareaInput.value = value.slice(0, cursorPos) + k.shiftKey + value.slice(cursorEnd);
              selected = false;
              cursorPos += 1;
            }
          }
        }
      });
    }
  }
  if (e.key === 'Shift') {
    shiftMode = true;
    if (lang === 'en') {
      KeyboardButtonsArr.forEach((key, i) => {
        if (key.shiftKey) {
          buttons[i].textContent = key.shiftKey;
        }
      });
    } else {
      KeyboardButtonsArr.forEach((key, i) => {
        if (key.shiftKey && !key.keyRu) {
          buttons[i].textContent = key.shiftKey;
        }
      });
    }
  }
  capsLock = e.getModifierState('CapsLock');
  localStorage.capsLock = capsLock;

  buttons.forEach((b, i) => {
    if (b.textContent.length < 3) {
      let content = b.textContent;
      buttons[i].textContent = capsLock ? content.toUpperCase() : content.toLowerCase();
    }
  });
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
  if (e.code === 'Tab') {
    e.preventDefault();
    let value = textareaInput.value;
    textareaInput.value = value.length === cursorPos
      ? value + '    '
      : value.slice(0, cursorPos) + '   ' + value.slice(cursorPos);
    cursorPos += 4;
  }
  console.log(cursorPos);
});

document.addEventListener('keyup', (e) => {
  if (/[а-яёЧЯ.* +?^ ${}() | [\]\\]/i.test(e.key)) {
    setTimeout(() => {
      if (!selected) {
        textareaInput.setSelectionRange(cursorPos, cursorPos);
        textareaInput.focus();
        selected = false;
      }
      if (selected) {
        textareaInput.setSelectionRange(cursorPos, cursorEnd);
        selected = true;
      }
    }, 0);
  }
  if (e.key === 'Shift') {
    shiftMode = false;
    if (lang === 'en') {
      KeyboardButtonsArr.forEach((key, i) => {
        if (key.shiftKey) {
          buttons[i].textContent = key.key;
        }
      });
    } else {
      KeyboardButtonsArr.forEach((key, i) => {
        if (key.shiftKey && !key.keyRu) {
          buttons[i].textContent = key.key;
        }
      });
    }
  }
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
    selected = false;
  }
  document.querySelector('#' + e.code).classList.remove('active');
});

keyboardBody.addEventListener('mousedown', (e) => {
  lang = localStorage.getItem('lang')
  console.log(lang)
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
      if (capsLock) {
        capsLock = false;
      } else {
        capsLock = true;
      }
      localStorage.setItem('capsLock', capsLock);
      buttons.forEach((key, i) => {
        let char = buttons[i].textContent
        if (!key.classList.contains('special-btn')) {
          buttons[i].textContent = capsLock ? char.toUpperCase() : char.toLowerCase();
        }
      });
    }
    if (e.target.classList.contains('Tab')) {
      e.preventDefault();
      textareaInput.value = value.length === cursorPos
        ? value + '    '
        : value.slice(0, cursorPos) + '   ' + value.slice(cursorPos);
      cursorPos += 4;
    }
    if (e.target.classList.contains('Shift')) {
      shiftMode = true;
      if (lang === 'en') {
        KeyboardButtonsArr.forEach((key, i) => {
          if (key.shiftKey) {
            buttons[i].textContent = key.shiftKey;
          }
        });
      } else {
        KeyboardButtonsArr.forEach((key, i) => {
          if (key.shiftKey && !key.keyRu) {
            buttons[i].textContent = key.shiftKey;
          }
        });
      }
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
    if (e.target.classList.contains('ArrowUp')) {
      let contentN = textareaInput.value.slice(0, cursorPos);
      let n = 0;
      contentN = contentN.split('').reverse();
      console.log(contentN)
      for (let i = 0; i < contentN.length; i++) {
        if (contentN[i] === '\n') {
          cursorPos -= i + 1;
          return;
        }
      }
    }
    if (e.target.classList.contains('ArrowDown')) {
      let contentN = textareaInput.value.slice(cursorPos);
      contentN = contentN.split('');
      console.log(contentN)
      for (let i = 0; i < contentN.length; i++) {
        if (contentN[i] === '\n') {
          cursorPos += i + 1;
          return;
        }
      }
    }
    if (e.target.classList.contains('Enter')) {
      textareaInput.value = value.length === cursorPos
        ? value + '\n'
        : value.slice(0, cursorPos) + '\n' + value.slice(cursorPos);
      cursorPos += 1;
    }
  }
});

document.addEventListener('mouseup', () => {
  if (shiftMode) {
    shiftMode = false;
    if (lang === 'en') {
      KeyboardButtonsArr.forEach((key, i) => {
        if (key.shiftKey) {
          buttons[i].textContent = key.key;
        }
      });
    } else {
      KeyboardButtonsArr.forEach((key, i) => {
        if (key.shiftKey && !key.keyRu) {
          buttons[i].textContent = key.key;
        }
      });
    }
  }
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
