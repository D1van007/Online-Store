import './double_range.css';

type DoubleRangeOptions = {
  min: number;
  max: number;
  eventName: string;
};

export class DoubleRange {
  parentDOM: HTMLElement;
  options: DoubleRangeOptions;
  containerDOM!: HTMLElement;
  firstInputDOM!: HTMLInputElement;
  secondInputDOM!: HTMLInputElement;
  firstInfoDOM!: HTMLElement;
  secondInfoDOM!: HTMLElement;
  default: [number, number];
  constructor(selector: HTMLElement, options: DoubleRangeOptions) {
    this.parentDOM = selector;
    this.options = options;
    this.default = [options.min, options.max];
    this.render();
    this.renderInfoCurrentValue();
    this.drEventsTracker();
  }
  render() {
    this.parentDOM.innerHTML = getHTML(this.options);
    this.containerDOM = this.parentDOM.querySelector('.double-range') as HTMLElement;
    this.firstInputDOM = this.containerDOM.querySelector('.double-range__i1') as HTMLInputElement;
    this.secondInputDOM = this.containerDOM.querySelector('.double-range__i2') as HTMLInputElement;
    this.secondInfoDOM = this.containerDOM.querySelector('.info__left') as HTMLElement;
    this.firstInfoDOM = this.containerDOM.querySelector('.info__right') as HTMLElement;
  }
  drEventsTracker() {
    this.firstInputDOM.addEventListener('input', () => {
      this.setBackgroundGradient();
      this.renderInfoCurrentValue();
    });
    this.secondInputDOM.addEventListener('input', () => {
      this.setBackgroundGradient();
      this.renderInfoCurrentValue();
    });
    this.firstInputDOM.addEventListener('change', this.changeEventHadler);
    this.secondInputDOM.addEventListener('change', this.changeEventHadler);
  }
  changeEventHadler = () => {
    this.customEvent();
  };
  removeListeners() {
    this.firstInputDOM.removeEventListener('change', this.changeEventHadler);
    this.secondInputDOM.removeEventListener('change', this.changeEventHadler);
  }
  customEvent(fakeEvent = false) {
    const doubleevent = new CustomEvent(this.options.eventName, {
      detail: {
        result: [+this.firstInputDOM.value, +this.secondInputDOM.value].sort((a, b) => a - b),
        isFake: fakeEvent,
      },
    });
    window.dispatchEvent(doubleevent);
  }
  renderInfoCurrentValue() {
    this.secondInfoDOM.style.left = `${
      (this.getPercent(this.firstInputDOM) / 100) * this.firstInputDOM.offsetWidth * 0.9
    }px`;
    this.secondInfoDOM.textContent = `${Math.round(Number(this.firstInputDOM.value))}`;
    this.firstInfoDOM.style.left = `${
      (this.getPercent(this.secondInputDOM) / 100) * this.secondInputDOM.offsetWidth * 0.9
    }px`;
    this.firstInfoDOM.textContent = `${Math.round(Number(this.secondInputDOM.value))}`;
  }
  setBackgroundGradient() {
    const minMaxArr = [this.getPercent(this.firstInputDOM), this.getPercent(this.secondInputDOM)].sort((a, b) => a - b);
    this.firstInputDOM.style.background = `linear-gradient(90deg, #f1d761 ${minMaxArr[0]}%, #3b9275 ${minMaxArr[0]}%, 
    #3b9275 ${minMaxArr[1]}%, #f1d761 ${minMaxArr[1]}%)`;
  }
  getPercent(elem: HTMLInputElement): number {
    return (Number(elem.value) / Number(elem.max)) * 100;
  }
  setRangeValue(min: number, max: number, evented = false) {
    this.firstInputDOM.value = min.toString();
    this.secondInputDOM.value = max.toString();
    this.setBackgroundGradient();
    this.renderInfoCurrentValue();
    if (evented) {
      this.customEvent(true);
    }
  }
}

function getHTML(options: DoubleRangeOptions): string {
  return `
  <div class="double-range">
    <input class="double-range__input double-range__i1" type="range" min="${options.min}" max="${options.max}" step="1" value="${options.min}">
    <input class="double-range__input double-range__i2" type="range" min="${options.min}" max="${options.max}" step="1" value="${options.max}">
    <div class="double-range__info">
      <span class="info__left">L</span>
      <span class="info__right">R</span>
    </div>
  </div>
  `;
}
