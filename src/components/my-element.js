import { LitElement, html } from "lit";

class MyElement extends LitElement {
    render() {
        return html`
          <h1>Hello, Lit Element!</h1>
        `;
      }
}

customElements.define('my-element',MyElement);