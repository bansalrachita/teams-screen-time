import React from 'react';
export const AuthenticationEnd: React.FC = () => {
  // Parse hash parameters into key-value pairs
  function getHashParameters() {
    let hashParams: { [x: string]: any } = {};
    window.location.hash
      .substr(1)
      .split('&')
      .forEach(function (item) {
        let s = item.split('='),
          k = s[0],
          v = s[1] && decodeURIComponent(s[1]);
        hashParams[k] = v;
      });
    return hashParams;
  }
  localStorage.removeItem('auth.error');
  let hashParams = getHashParameters();
  if (hashParams['error']) {
    // Authentication/authorization failed
    localStorage.setItem('auth.error', JSON.stringify(hashParams));
    microsoftTeams.authentication.notifyFailure(hashParams['error']);
  } else if (hashParams['access_token']) {
    // Get the stored state parameter and compare with incoming state
    let expectedState = localStorage.getItem('auth.state');
    if (expectedState !== hashParams['state']) {
      // State does not match, report error
      localStorage.setItem('auth.error', JSON.stringify(hashParams));
      microsoftTeams.authentication.notifyFailure('StateDoesNotMatch');
    } else {
      // Success -- return token information to the parent page.
      // Use localStorage to avoid passing the token via notifySuccess; instead we send the item key.
      let key = 'auth.result';
      // TODO: not sure why this isn't being set
      localStorage.setItem(
        key,
        JSON.stringify({
          idToken: hashParams['id_token'],
          accessToken: hashParams['access_token'],
          tokenType: hashParams['token_type'],
          expiresIn: hashParams['expires_in'],
        })
      );
      microsoftTeams.authentication.notifySuccess(key);
    }
  } else {
    // Unexpected condition: hash does not contain error or access_token parameter
    localStorage.setItem('auth.error', JSON.stringify(hashParams));
    microsoftTeams.authentication.notifyFailure('UnexpectedFailure');
  }

  return null;
};
