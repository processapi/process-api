export default class HomeView extends HTMLElement {
  static tag = "home-view";

  load(data) {
    console.log(data);
  }
}

customElements.define(HomeView.tag, HomeView);