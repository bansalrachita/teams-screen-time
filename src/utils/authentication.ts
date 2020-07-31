import * as microsoftTeams from '@microsoft/teams-js';

class Authentication {
  private _accessToken: string | undefined = undefined;
  public readonly resources: string[] = [process.env.REACT_APP_API_URL!];

  public initialize = async (callback: (val?: string) => void) => {
    try {
      await this.login(callback);
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
        const tid = context.tid;
        const token = clientSideToken;
        const scopes = ['https://graph.microsoft.com/User.Read'];

        const oboPromise = async (): Promise<string> => {
          return new Promise((res, rej) => {
            const url =
              'https://login.microsoftonline.com/' + tid + '/oauth2/v2.0/token';
            const params = {
              client_id: process.env.REACT_APP_CLIENT_APP_ID,
              client_secret: process.env.REACT_APP_CLIENT_SECRET,
              grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
              assertion: token,
              requested_token_use: 'on_behalf_of',
              scope: scopes.join(' '),
            };

            fetch(url, {
              method: 'POST',
              body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}&assertion=${token}&requested_token_use=${params.requested_token_use}&scope=${params.scope}`,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                mode: 'cors',
              },
            }).then((result) => {
              if (result.status !== 200) {
                result.json().then((json) => {
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
          resolve(access_token);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  // Show the consent pop-up
  public requestConsent = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      microsoftTeams.authentication.authenticate({
        url: window.location.origin + '/authstart',
        width: 600,
        height: 535,
        successCallback: (result) => {
          let data = localStorage.getItem(result ?? '') ?? '';
          localStorage.removeItem(result ?? '');
          resolve(data);
        },
        failureCallback: (reason) => {
          const result = 'auth.result';
          let data = localStorage.getItem(result ?? '') ?? '';
          this._accessToken = data;
          localStorage.removeItem(result ?? '');
          console.log('reason: ', reason);
          reject(JSON.stringify(reason));
        },
      });
    });
  };

  public login = async (callback: (val?: string) => void): Promise<void> => {
    try {
      const clientToken = await this.fetchAccessToken();
      this._accessToken = await this.getServerSideToken(clientToken);
    } catch (error) {
      if (error === 'invalid_grant') {
        console.log(`Error: ${error} - user or admin consent required`);
        try {
          const result = await this.requestConsent();
          if (result) {
            // Consent succeeded - use the token we got back
            let accessToken = JSON.parse(result).accessToken;
            console.log(`Received access token ${accessToken}`);
            this._accessToken = accessToken;
          }
        } catch (error) {
          console.log(`ERROR ${error}`);
        }
      }
    } finally {
      callback(this._accessToken);
    }
  };
}

export default new Authentication();
