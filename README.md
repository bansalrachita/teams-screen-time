# Teams screen time

An application that captures users activity on teams like personal chats, chats/posts in channels inside Teams and gives meaniful insights to the user about their usage and personal contributions within Teams.

## Tools and technologies

- [VScode Teams toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)
- [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant)
- Teams SSO
- Personal app (Teams extensibility)
- Azure AAD
- MS Graph APIs
- ngrok.io
- NodeJS


## Pre-requisites
- Download and install ngrok from the web.
- Run ngrok.exe on port 3333. ngrok will tunnel the web request to your localhost and terminate the SSL connection from Teams.
- Replace the subdomain in manifest file in the publish folder.
- Upload the new zipped folder in [Teams](https://teams.microsoft.com).
- Create a 3rd party app using your MS developer account OR 
- Replace the subdomain in AAD app registration -> Authentication tab.

## Tabs

Tabs are Teams-aware webpages embedded in Microsoft Teams. Personal tabs are scoped to a single user. They can be pinned to the left navigation bar for easy access.

### Create an app on Azure


### Build and Run
In the project directory, execute:

`npm install`

`npm start`

### Deploy to Teams

**Launch app from VS Code**

- Navigate to the activity bar on the left side of the Visual Studio Code window.
- Select the Run icon to display the Run and Debug view.
- You can also use the keyboard shortcut Ctrl+Shift+D. 

**Upload app from the Teams client**
- You can also upload the `Development.zip` from the *.publish* folder to Teams - [Upload a custom app](https://aka.ms/teams-toolkit-uploadapp) 