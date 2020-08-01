# Teams screen time

An application that captures user's activity on Teams like personal chats, chats/posts in channels and gives meaniful insights to the user about their usage and personal contributions within Teams.


![Giff showing active hours!](https://raw.githubusercontent.com/bansalrachita/teams-time-analyzer/master/public/images/ezgif.com-video-to-gif.gif?token=ACM7R7VABIIU4PHUZJKQAAS7EURNG
"Active Hours")


## Tools and technologies

- [VScode Teams toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)
- [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant)
- Teams SSO (OBO flow)
- Personal app (using Teams Extensibility Framework)
- Azure AAD (Azure Active Directory)
- MS Graph APIs
- Ngrok
- NodeJS
- ReactJS

## Pre-requisites

- Download and install ngrok from the web.
- Run `ngrok.exe` on port `3333`. ngrok will tunnel the web request to your localhost and terminate the SSL connection from Teams.
- Replace the subdomain in manifest file in the publish folder.
- Create a 3rd party app using your MS developer account.
- Replace the subdomain in AAD app registration -> Authentication tab with the one that's  created by ngrok.

## Tabs

Tabs are Teams-aware webpages embedded in Microsoft Teams. Personal tabs are scoped to a single user. They can be pinned to the left navigation bar for easy access.

**Teams screen time**

Teams screen time is a personal app that gets user's chats personal or in channels and calculates users active hours. It shows these stats using a graphical view of hourly representation of the data during the week.

![Image showing active hours!](https://raw.githubusercontent.com/bansalrachita/teams-time-analyzer/master/public/images/teams-screen-time.png?token=ACM7R7UTDCTLGSCMZUTKQSK7EURLI
"Active Hours")

It also compares read/write times of a user's engagement across his/her teams and allows filtering for channels inside a team.


![Image showing channel activity!](https://raw.githubusercontent.com/bansalrachita/teams-time-analyzer/master/public/images/teams-screen-time-2.png?token=ACM7R7VQ7JFUYH7ZYSRBZD27EURBK "Image showing channel activity")

#### Create an app on Azure

- Goto to Azure AD -> App registrations -> Create a new App (3rd party)
- Goto Authentication after registering the app -> Add a platform (Web)
- Configure the redirect for the app, Allow for ID token and Access tokens (hybrid mode).
- Add an application ID URL and allow Teams client to access Graph APIs on signed users behalf (on behalf flow)
- You can make the app multi tenant or Single tenant based on your use case.
- Goto API permission and add the necessary permissions required by the user to access information through Graph APIs.

#### App permissions

Goto to Azure AD -> App registrations and add the needed permissions for the app to be able to access user's data like their joined teams, channels, channel messages and personal chats. On behalf of user flow requires the consent of the tenant admin for these permissions before Teams can actually get a token that has the said scopes on behalf of the user. 

*This is also a known limitation of the app.*

#### Expose an API

To enable Teams to request data on behalf of the user without user consent, we need to exposing an App API URL for Teams Desktop and mobile platform app.
Goto Azure AD -> App registrations -> choose your app name -> Expose an API.
Add an App ID URI if it's not present. An App ID URI usually looks like this - `api://<app-subdomain>.example.com/<app-client-id>`

Add the Teams client IDs to the API:
- Desktop/mobile client: `1fec8e78-bce4-4aaf-ab1b-5451cc387264`
- Web client: `5e3ce6c0-2b1f-4285-8d4b-75ee78787346`


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

### Improvements:
- Storing the users data in localstorage and caching for better performance on the client.
- Collecting other information like media exchanges, most discussed topics, granularity of details view of active hours per channel etc.
