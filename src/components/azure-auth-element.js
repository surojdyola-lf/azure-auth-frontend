// azure-auth-element.js
import {LitElement, html, css} from 'lit';
import {PublicClientApplication} from '@azure/msal-browser';
import {msalConfig, loginRequest} from './authConfig';


class AzureAuthElement extends LitElement {
  static properties = {
    idToken: {type: String},
    token: {type: String},
    displayName: {type: String},
    data: { type: Array },
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
    this.data = [];
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
        this.token = authResult.accessToken;
        this.idToken = authResult.idToken;
        this.fetchUserDetails(this.token);
      }
    } catch (error) {
      console.log('Authentication failed', error);
    }
  }

  async fetchUserDetails(token) {
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(userData)
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
    this.displayName = ''; // Clear user information
  }

  async fetchData() {

    this.data = await this.fetchDataFromBackend(this.idToken);
  }

  async fetchDataFromBackend(idToken) {
    console.log("ID Token: "+idToken);
    const response = await fetch('http://localhost:8080/api/data', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.ok) {
      const backendData = await response.json();
        console.log(backendData)
      return backendData;
    } else {
      console.error('Error fetching data:', response.status);
      return [];
    }
  }

  render() {
    if (this.token) {
      return html`
        <div class="centered-container">
          <p>Welcome, ${this.displayName}!</p>
          <button @click="${this.logout}">Logout</button>
          <br/>
          <button @click="${this.fetchData}">Fetch Data</button>
          <!-- <div id="userDetails"></div> -->
          <br/>
          ${this.data.length
        ? html`
            <table style="border: 1px solid black;">
              <thead>
                <tr>
                  <th>City</th>

                </tr>
              </thead>
              <tbody>
                ${this.data.map(
                  (item) => html`
                    <tr>
                      <td>${item}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          `
        : ''}
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
