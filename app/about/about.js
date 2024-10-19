export default class AboutView extends HTMLElement {
  static tag = "about-view";

  load(data) {
    console.log(data);
  }
}

customElements.define(AboutView.tag, AboutView);