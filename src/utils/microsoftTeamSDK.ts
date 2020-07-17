import * as microsoftTeams from '@microsoft/teams-js';

class MicrosoftTeamsSDK {
  private _accessToken: string | null = null;
  public readonly resources: string[] = [
    'https://graph.microsoft.com',
    'https://d7410907d884.ngrok.io',
  ];

  constructor() {
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();
  }

  public initialize = async () => {
    try {
      this._accessToken = await this.fetchAccessToken();
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
}

export const microsoftTeamsSDK = new MicrosoftTeamsSDK();
