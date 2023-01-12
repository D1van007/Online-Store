import { eventedPushState } from '../router/events_history';

export class CopyClearURL {
  parentDOM!: HTMLElement;
  copyBtnDOM!: HTMLElement;
  clearBtnDOM!: HTMLElement;
  constructor(selector: HTMLElement) {
    this.parentDOM = selector;
    this.render();
    this.createEventHandlers();
  }
  render() {
    this.parentDOM.insertAdjacentHTML('afterbegin', getHTML());
    this.copyBtnDOM = this.parentDOM.querySelector('.copy-btn') as HTMLElement;
    this.clearBtnDOM = this.parentDOM.querySelector('.clear-btn') as HTMLElement;
  }
  createEventHandlers() {
    this.clearBtnDOM.addEventListener('click', () => {
      eventedPushState({}, '', '/');
    });
    this.copyBtnDOM.addEventListener('click', () => {
      this.copyBtnDOM.classList.add('btn-active');
      navigator.clipboard.writeText(`${window.location.href}`);
    });
  }
}

function getHTML(): string {
  return `
    <div class="copy-clear">
      <button class="copy-btn btn-style">CopyURL</button>
      <button class="clear-btn btn-style">ClearURL</button>
    </div>
  `;
}
