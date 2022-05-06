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
textareaWrapper.appendChild(textareaInput);

const keyboardBody = document.createElement('div');
keyboardBody.className = 'keyboard-body';
container.appendChild(keyboardBody);

createKButton(keyboardBody);

document.addEventListener('keydown', (e) => {
  document.querySelector('#' + e.code).classList.add('active');
});
document.addEventListener('keyup', (e) => {
  document.querySelector('#' + e.code).classList.remove('active');
});


