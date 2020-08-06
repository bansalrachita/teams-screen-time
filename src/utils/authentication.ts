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
        try {
          const tid = context.tid;
          const token = clientSideToken;

          const url =
            process.env.REACT_APP_API_URL +
            ':' +
            process.env.REACT_APP_API_PORT +
            '/auth/token';
          const params = {
            token,
            tid,
          };

          const result = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          const json = await result.json();

          if (result.status !== 200) {
            reject(json.error);
          } else {
            resolve(json.access_token);
          }
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
          this._accessToken = JSON.parse(data)?.accessToken;
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
