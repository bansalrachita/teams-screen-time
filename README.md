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

#### Create an app on Azure

- Goto to Azure AD -> App registrations -> Create a new App (3rd party)
- Goto Authentication after registering the app -> Add a platform (Web)
- Configure the redirect for the app, Allow for ID token and Access tokens (hybrid mode).
- Add an application ID URL and allow Teams client to access Graph APIs on signed users behalf (on behalf flow)
- You can make the app multi tenant or Single tenant based on your use case.
- Goto API permission and add the necessary permissions required by the user to access information through Graph APIs.

### Build and Run

In the project directory, execute:

`npm install`

`npm start`

In the directory where you have installed ngrok, execute:

`.\ngrok.exe http 3333 --host-header=localhost`

This will open up a tunnel for about 8 hrs and after that you need to repeat the command and depoly step given below.

Login into [Azure portal](https://portal.azure.com), look for your registered app in AAD and
replace the subdomain of the redirect URL in the following places:

Authentication -> Web/SPA redirect URL
Expose an API -> replace Application ID URL subdomain with the one you generated using ngrok.

`api://<subdomain>.ngrok.io/<client_id>`

### Deploy to Teams

**Launch app from VS Code**

- Navigate to the activity bar on the left side of the Visual Studio Code window.
- Select the Run icon to display the Run and Debug view.
- You can also use the keyboard shortcut Ctrl+Shift+D.

**Upload app from the Teams client**

- You can also upload the `Development.zip` from the _.publish_ folder to Teams - [Upload a custom app](https://aka.ms/teams-toolkit-uploadapp)
