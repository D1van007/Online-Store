export class Page404 {
  page404Container: HTMLElement;
  page404Content!: HTMLElement;
  constructor(selector: string) {
    this.page404Container = document.querySelector(selector) as HTMLElement;
    this.renderPage404Content();
  }

  renderPage404Content() {
    this.page404Content = document.createElement('div');
    this.page404Content.classList.add('page404__content');
    this.page404Container.prepend(this.page404Content);
    this.page404Content.innerHTML = createHTMLContent();
  }
}

function createHTMLContent(): string {
  return ` 
    <h1 class="page404__title"> Sorry, this page is not found
    </h1>`;
}
