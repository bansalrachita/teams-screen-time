import React from 'react';
import * as microsoftTeams from '@microsoft/teams-js';

function _decimalToHex(number: number) {
  var hex = number.toString(16);
  while (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
}

function _guid() {
  var cryptoObj = window.crypto || window.crypto; // forIE 11
  if (cryptoObj && cryptoObj.getRandomValues) {
    var buffer = new Uint8Array(16);
    cryptoObj.getRandomValues(buffer); //buffer[6] and buffer[7] represents the time_hi_and_version field. We will set the four most significant bits (4 through 7) of buffer[6] to represent decimal number 4 (UUID version number).
    buffer[6] |= 0x40; //buffer[6] | 01000000 will set the 6 bit to 1.
    buffer[6] &= 0x4f; //buffer[6] & 01001111 will set the 4, 5, and 7 bit to 0 such that bits 4-7 == 0100 = "4". //buffer[8] represents the clock_seq_hi_and_reserved field. We will set the two most significant bits (6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively.
    buffer[8] |= 0x80; //buffer[8] | 10000000 will set the 7 bit to 1. buffer[8] &= 0xbf;
    //buffer[8] & 10111111 will set the 6 bit to 0.
    return (
      _decimalToHex(buffer[0]) +
      _decimalToHex(buffer[1]) +
      _decimalToHex(buffer[2]) +
      _decimalToHex(buffer[3]) +
      '-' +
      _decimalToHex(buffer[4]) +
      _decimalToHex(buffer[5]) +
      '-' +
      _decimalToHex(buffer[6]) +
      _decimalToHex(buffer[7]) +
      '-' +
      _decimalToHex(buffer[8]) +
      _decimalToHex(buffer[9]) +
      '-' +
      _decimalToHex(buffer[10]) +
      _decimalToHex(buffer[11]) +
      _decimalToHex(buffer[12]) +
      _decimalToHex(buffer[13]) +
      _decimalToHex(buffer[14]) +
      _decimalToHex(buffer[15])
    );
  } else {
    var guidHolder = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var hex = '0123456789abcdef';
    var r = 0;
    var guidResponse = '';
    for (var i = 0; i < 36; i++) {
      if (guidHolder[i] !== '-' && guidHolder[i] !== '4') {
        // each x and y needs to be random
        r = (Math.random() * 16) | 0;
      }
      if (guidHolder[i] === 'x') {
        guidResponse += hex[r];
      } else if (guidHolder[i] === 'y') {
        // clock-seq-and-reserved first hex is filtered and remaining hex values are random
        r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
        r |= 0x8; // set pos 3 to 1 as 1???
        guidResponse += hex[r];
      } else {
        guidResponse += guidHolder[i];
      }
    }
    return guidResponse;
  }
}

function toQueryString(queryParams: {
  [x: string]: string | string[] | number | boolean;
}) {
  let encodedQueryParams = [];
  for (let key in queryParams) {
    // @ts-ignore
    encodedQueryParams.push(key + '=' + encodeURIComponent(queryParams[key]));
  }
  return encodedQueryParams.join('&');
}

export const AuthenticationStart: React.FC = () => {
  microsoftTeams.getContext(function (context) {
    let state = _guid();
    localStorage.setItem('auth.state', state ?? '');
    localStorage.removeItem('auth.error');
    let queryParams = {
      client_id: '625ae2e7-df68-48d2-b538-50eeed288578',
      response_type: 'id_token token',
      response_mode: 'fragment',
      scope: [
        'https://graph.microsoft.com/User.Read email openid profile offline_access',
      ],
      redirect_uri: window.location.origin + '/authend',
      nonce: _guid(),
      state: state,
      login_hint: context.loginHint,
    };
    let authorizeEndpoint = `https://login.microsoftonline.com/${
      context.tid
      // @ts-ignore
    }/oauth2/v2.0/authorize?${toQueryString(queryParams)}`;
    window.location.assign(authorizeEndpoint);
  });

  return null;
};
