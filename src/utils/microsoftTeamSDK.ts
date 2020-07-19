import * as microsoftTeams from '@microsoft/teams-js';

class MicrosoftTeamsSDK {
  private _accessToken: string | null = null;
  public readonly resources: string[] = [
    // 'https://graph.microsoft.com',
    'https://5b60d8ade181.ngrok.io',
  ];

  public initialize = async () => {
    try {
      this.login();
    } catch (error) {
      throw new Error('Error authenticating the user: ' + error.message);
    }
  };

  public readonly getAccessToken = () => {
    return this._accessToken;
  };

  private fetchAccessToken = async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      microsoftTeams.authentication.getAuthToken({
        resources: this.resources,
        successCallback: (accessToken: string) => {
          console.log('accessToken: ', accessToken);
          resolve(accessToken);
        },
        failureCallback: (reason) => {
          reject(reason);
        },
      });
    });
  };

  // 2. Exchange that token for a token with the required permissions
  //    using the web service (see /auth/token handler in app.js)
  public getServerSideToken = async (
    clientSideToken: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      microsoftTeams.getContext(async (context) => {
        console.log('context: ', context);
        const tid = context.tid;
        const token = clientSideToken;
        const scopes = ['https://graph.microsoft.com/User.Read'];

        const oboPromise = async (): Promise<string> => {
          return new Promise((res, rej) => {
            const url =
              'https://login.microsoftonline.com/' + tid + '/oauth2/v2.0/token';
            const params = {
              client_id: '625ae2e7-df68-48d2-b538-50eeed288578',
              client_secret: 'tA1HdHx~uy8yW.I-fc2XYxi1jOk5--.dbR',
              grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
              assertion: token,
              requested_token_use: 'on_behalf_of',
              scope: scopes.join(' '),
            };

            fetch(url, {
              method: 'POST',
              body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}&assertion=${token}&requested_token_use=${params.requested_token_use}&scope=${params.scope[0]}`,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                mode: 'no-cors',
              },
            }).then((result) => {
              if (result.status !== 200) {
                result.json().then((json) => {
                  console.log('json: ', json);
                  // TODO: Check explicitly for invalid_grant or interaction_required
                  rej(json.error);
                });
              } else {
                result.json().then((json) => {
                  res(json.access_token);
                });
              }
            });
          });
        };

        try {
          const access_token = await oboPromise();
          const serverSideToken = access_token;
          console.log(serverSideToken);
          resolve(serverSideToken);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  // Show the consent pop-up
  public requestConsent = async (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      microsoftTeams.authentication.authenticate({
        url: window.location.origin + '/authstart',
        width: 600,
        height: 535,
        successCallback: (result) => {
          console.log('result: ', result);
          let data = localStorage.getItem(result ?? '');
          localStorage.removeItem(result ?? '');
          resolve(data);
        },
        failureCallback: (reason) => {
          console.log('reason: ', reason);
          reject(JSON.stringify(reason));
        },
      });
    });
  };

  // 3. Get the server side token and use it to call the Graph API
  public useServerSideToken = async (data: string | null): Promise<void> => {
    console.log(
      '3. Call https://graph.microsoft.com/v1.0/me/ with the server side token'
    );
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me/', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'bearer ' + data,
        },
        mode: 'cors',
        cache: 'default',
      });
      if (response.ok) {
        const profile = await response.json();
        console.log(JSON.stringify(profile, undefined, 4), 'pre');
        return response.json();
      } else {
      }
    } catch (error) {
      throw new Error(`Error ${error}`);
    }
  };

  public login = async (): Promise<void> => {
    try {
      const clientToken = await this.fetchAccessToken();
      this._accessToken = await this.getServerSideToken(clientToken);
      console.log('_accessToken: ', this._accessToken);
    } catch (error) {
      console.log('error: ', error);
      if (error === 'invalid_grant') {
        console.log(`Error: ${error} - user or admin consent required`);
        try {
          const result = await this.requestConsent();
          console.log('result: ', result);
          if (result) {
            // Consent succeeded - use the token we got back
            let accessToken = JSON.parse(result).accessToken;
            console.log(`Received access token ${accessToken}`);
            this.useServerSideToken(accessToken);
          }
        } catch (error) {
          console.log(`ERROR ${error}`);
        }
      }
    }
  };
}

export const microsoftTeamsSDK = new MicrosoftTeamsSDK();