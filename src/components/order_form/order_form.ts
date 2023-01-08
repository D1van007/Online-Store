import './order_form.css';
import IMask from 'imask';
import * as EmailValidator from 'email-validator';
import { eventedPushState } from '../router/events_history';
import { LocalCart } from '../cart/cart_module/localCart';

type IMaskType = ReturnType<typeof IMask>;

export class OrderForm {
  bodyDOM: HTMLBodyElement = document.querySelector('body')!;
  coverDOM!: HTMLElement;
  formContainerDOM!: HTMLElement;
  inputNameDOM!: HTMLInputElement;
  eMailDOM!: HTMLInputElement;
  phoneDOM!: HTMLInputElement;
  phoneMask!: IMaskType;
  ccnMask!: IMaskType;
  ccdMask!: IMaskType;
  ccvMask!: IMaskType;
  cardNumberDOM!: HTMLInputElement;
  cardDateDOM!: HTMLInputElement;
  cardCCVDOM!: HTMLInputElement;
  submitButtonDOM!: HTMLButtonElement;
  cardLogoContainerDOM!: HTMLDivElement;
  addressDOM!: HTMLInputElement;
  localCart: LocalCart | undefined;
  constructor() {
    this.render();
    this.coverEventHandler();
    this.inputsEventHandler();
    this.createPhoneMask();
    this.createCCNMask();
    this.createCCDMask();
    this.createCCVMask();
  }
  render() {
    this.bodyDOM.insertAdjacentHTML('afterbegin', getHTML());
    this.coverDOM = document.querySelector('.cover')!;
    this.formContainerDOM = document.querySelector('.form-contaner')!;
    this.inputNameDOM = document.querySelector('.input-name')!;
    this.addressDOM = document.querySelector('.input-address')!;
    this.phoneDOM = document.querySelector('.input-phone')!;
    this.eMailDOM = document.querySelector('.input-email')!;
    this.cardNumberDOM = document.querySelector('.input-ccn')!;
    this.cardDateDOM = document.querySelector('.input-ccd')!;
    this.cardCCVDOM = document.querySelector('.input-ccv')!;
    this.submitButtonDOM = document.querySelector('.submit-button')!;
    this.cardLogoContainerDOM = document.querySelector('.card-logo')!;
  }
  coverEventHandler() {
    this.coverDOM.addEventListener('click', () => {
      this.desroy();
    });
  }
  inputsEventHandler() {
    this.inputNameDOM.addEventListener('focusout', () => {
      this.nameAndAdressValidation(this.inputNameDOM, 2, 3);
      console.log('test');
    });
    this.addressDOM.addEventListener('focusout', () => {
      this.nameAndAdressValidation(this.addressDOM, 3, 5);
      console.log('test');
    });
    this.eMailDOM.addEventListener('focusout', () => {
      this.eMailValidation();
    });
    this.phoneDOM.addEventListener('focusout', () => {
      this.inputValidation(this.phoneMask, this.phoneDOM, 9);
    });
    this.cardNumberDOM.addEventListener('focusout', () => {
      this.inputValidation(this.ccnMask, this.cardNumberDOM, 16);
    });
    this.cardDateDOM.addEventListener('focusout', () => {
      this.inputValidation(this.ccdMask, this.cardDateDOM, 4);
    });
    this.cardCCVDOM.addEventListener('focusout', () => {
      this.inputValidation(this.ccvMask, this.cardCCVDOM, 3);
    });
    this.submitButtonDOM.addEventListener('click', e => {
      e.preventDefault();
      this.submitButtonEventHeandler();
    });
    this.cardNumberDOM.addEventListener('input', () => {
      this.changeCardImage();
    });
  }
  submitButtonEventHeandler() {
    const allInputs = this.formContainerDOM.querySelectorAll('input');
    const arr = Array.from(allInputs);
    if (arr.some(e => !e.validity.valid)) {
      console.log('не валидно');
    } else {
      this.formContainerDOM.innerHTML = '<p class="end_purchase">Спасибо за покупку</p>';
      this.localCart = new LocalCart();
      this.localCart.clearCart();
      setTimeout(() => {
        this.desroy();
        eventedPushState({}, '', '/');
      }, 3000);
    }
  }
  nameAndAdressValidation(elem: HTMLInputElement, strCount: number, sumbolCount: number) {
    elem.classList.add('validation');
    elem.value = elem.value.trim();
    const currentValue = elem.value;
    console.log(currentValue.split(' ').length);
    if (currentValue.split(' ').length < strCount) {
      elem.setCustomValidity('Invalid field.');
      console.log(elem.validity);
    } else {
      const arr = currentValue.split(' ');
      if (arr.some(e => e.length < sumbolCount)) {
        elem.setCustomValidity('Invalid field.');
      } else {
        elem.setCustomValidity('');
      }
    }
  }
  eMailValidation() {
    this.eMailDOM.classList.add('validation');
    this.eMailDOM.value = this.eMailDOM.value.trim();
    const currentValue = this.eMailDOM.value;
    if (!EmailValidator.validate(currentValue)) {
      console.log('inv');
      this.eMailDOM.setCustomValidity('Invalid field.');
    } else {
      this.eMailDOM.setCustomValidity('');
    }
  }
  inputValidation(mask: IMaskType, elem: HTMLInputElement, value: number) {
    elem.classList.add('validation');
    if (mask.unmaskedValue.length < value) {
      elem.setCustomValidity('Invalid field.');
    } else {
      elem.setCustomValidity('');
    }
  }
  changeCardImage() {
    if (this.cardNumberDOM.value.length > 0 && this.cardNumberDOM.value.length < 2) {
      const children = this.cardLogoContainerDOM.querySelectorAll('i');
      const defaultCard: HTMLElement = this.cardLogoContainerDOM.querySelector('.fa-credit-card')!;
      const americanExpress: HTMLElement = this.cardLogoContainerDOM.querySelector('.fa-cc-amex')!;
      const visa: HTMLElement = this.cardLogoContainerDOM.querySelector('.fa-cc-visa')!;
      const mastercard: HTMLElement = this.cardLogoContainerDOM.querySelector('.fa-cc-mastercard')!;
      const clear = () => {
        children.forEach(e => {
          console.log(e);
          e.style.display = 'none';
        });
      };
      switch (this.cardNumberDOM.value[0]) {
        case '3':
          clear();
          americanExpress.style.display = 'block';
          break;
        case '4':
          clear();
          visa.style.display = 'block';
          break;
        case '5':
          clear();
          mastercard.style.display = 'block';
          break;
        default:
          clear();
          defaultCard.style.display = 'block';
      }
    }
  }
  createPhoneMask() {
    const maskOptions = {
      mask: '+0(000)000-00-00',
    };
    this.phoneMask = IMask(this.phoneDOM, maskOptions);
  }
  createCCNMask() {
    const maskOptions = {
      mask: '0000 0000 0000 0000',
    };
    this.ccnMask = IMask(this.cardNumberDOM, maskOptions);
  }
  createCCDMask() {
    const maskOptions = {
      mask: 'MM / YY',
      lazy: false,

      blocks: {
        YY: {
          mask: '00',
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
        },
      },
    };
    this.ccdMask = IMask(this.cardDateDOM, maskOptions);
  }
  createCCVMask() {
    const maskOptions = {
      mask: '000',
    };
    this.ccvMask = IMask(this.cardCCVDOM, maskOptions);
  }
  desroy() {
    this.bodyDOM.removeChild(this.coverDOM);
    this.bodyDOM.removeChild(this.formContainerDOM);
  }
}

function getHTML() {
  return `
  <div class="cover"></div>
  <div class="form-contaner">
    <form class="order-form" action="" method="post">
      <p>
        <label for="name">Введите имя:</label>
        <input class="input-name" type="text" name="name" id="name" required>
      </p>
      <p>
        <label for="address">Введите адрес:</label>
        <input class="input-address" type="address" name="address" id="address" required>
      </p>
      <p>
        <label for="name">Введите телефон:</label>
        <input class="input-phone" type="text" name="phone" id="phone" required>
      </p>
      <p>
        <label for="email">Введите email:</label>
        <input class="input-email" type="email" name="email" id="email" required>
      </p>
      <p>
        <label for="ccn">Введите номер карты:</label>
        <input id="ccn" class="input-ccn" type="tel" inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="xxxx xxxx xxxx xxxx">
        <div class="card-logo">
          <i class="fa-solid fa-credit-card"></i>
          <i class="fa-brands fa-cc-visa"></i>
          <i class="fa-brands fa-cc-mastercard"></i>
          <i class="fa-brands fa-cc-amex"></i>
        </div>
      </p>
      <p>
        <label for="ccd">Введите дату:</label>
        <input class="input-ccd" type="tel" name="ccd" id="ccd" minlength="19" required>
      </p>
      <p>
        <label for="ccv">ccv:</label>
        <input class="input-ccv" type="tel" name="ccv" id="ccv" required>
      </p>
      <button class="submit-button" type="submit">Отправить</button>
    </form>
  </div>
  `;
}
