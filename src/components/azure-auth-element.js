// azure-auth-element.js
import {LitElement, html, css} from 'lit';
import {PublicClientApplication} from '@azure/msal-browser';
import {msalConfig, loginRequest} from './authConfig';


class AzureAuthElement extends LitElement {
  static properties = {
    token: {type: String}
  };

  static styles = css`
    .centered-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh; /* 100% of the viewport height */
    }

    button {
      background-color: #0078d4;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }

    button:hover {
      background-color: #005ea2;
    }

    #logoutButton {
      background-color: #e74c3c;
    }
  `;
  constructor() {
    super();
    this.msalInstance = null;
  }

  firstUpdated() {
    this.msalInstance = new PublicClientApplication(msalConfig);
    this.msalInstance.initialize();
  }

  async loginWithAzure() {
    try {
      const authResult = await this.msalInstance.loginPopup({});
      console.log('Authentication successful', authResult);
      if (authResult.idToken) {
        console.log(authResult.accessToken);
        this.token = authResult.accessToken;
        this.fetchUserDetails(this.token);
      }
    } catch (error) {
      console.log('Authentication failed', error);
    }
  }

  async fetchUserDetails(token) {
    try {
      const response = await fetch(graphConfig.graphMeEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        //console.log(userData)
        this.displayName = userData.displayName;
        this.renderUserDetails(userData);
      } else {
        // Handle the error
        console.log('ERROR1');
      }
    } catch (error) {
      // Handle network or other errors
      console.log('ERROR2 ', error);
    }
  }

  renderUserDetails(userData) {
    const userDetailsDiv = this.shadowRoot.getElementById('userDetails');
    userDetailsDiv.innerHTML = `
  <pre>${JSON.stringify(userData, null, 2)}</pre>`;
  }

  async logout() {
    // Sign the user out
    await this.msalInstance.logoutPopup();
    this.token = ''; // Clear the token
    //this.displayName = ''; // Clear user information
  }

  render() {
    if (this.token) {
      return html`
        <div class="centered-container">
          <p>Welcome, ${this.displayName}!</p>
          <button @click="${this.logout}">Logout</button>
          <div id="userDetails"></div>
        </div>
      `;
    } else {
      return html`
        <div class="centered-container">
          <button @click="${this.loginWithAzure}">Login with Azure</button>
        </div>
      `;
    }
  }
}

customElements.define('azure-auth-element', AzureAuthElement);
