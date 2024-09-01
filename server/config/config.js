const assignKey = (query) => {
  let obj = {};
  obj[config.apiKeyName] = config.apiKeyValue;
  return Object.assign(query, obj);
};

const logPort = (port) => {
  return () =>
    console.log(
      `[\x1b[34mSERVER\x1b[37m] Listening on port: \x1b[36m${port} 🤖 \x1b[37m`
    );
};

const config = {
  apiUrl: process.env.API_URL,
  apiKeyName: process.env.API_KEY_NAME,
  apiKeyValue: process.env.API_KEY_VALUE,
  port: process.env.PORT || 8080,
  assignKey: assignKey,
};

const routes = {
  '/champion/rotations': {
    method: () => '/lol/platform/v3/champion-rotations',
    cache: '1 day'
  },
  '/featured-games': {
    method: () => `/lol/spectator/v4/featured-games`,
    cache: '1 minute'
  },
  '/summoner/by-name/:summonerName': {
    method: ({ summonerName }) => `/lol/summoner/v4/summoners/by-name/${summonerName}`,
    cache: '7 day'
  },
  '/summoner/league/:encryptedSummonerId': {
    method: ({ encryptedSummonerId }) => `/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`,
    cache: '7 day'
  },
  '/summoner/matches/:summonerPuuid': {
    method: ({ summonerPuuid }) => `/lol/match/v5/matches/by-puuid/${summonerPuuid}/ids`,
    cache: '7 day'
  },
  '/match/:matchId': {
    method: ({ matchId }) => `/lol/match/v5/matches/${matchId}`,
    cache: '1 year'
  },
  '/match/:matchId/timeline': {
    method: ({ matchId }) => `/lol/match/v5/matches/${matchId}/timeline`,
    cache: '1 year'
  },
  '/summoner/:encryptedSummonerId/active-game': {
    method: ({ encryptedSummonerId }) => `/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}`,
    cache: '1 second'
  },
}

const usedPuuids = {
  europe: [
    'V2uSNcbcUiCvzF-0uHjhzLRyKYBPCuGugbfsK7LomPFDVTxXpmAGK_8cFMLQPQCiKw_HWyjQtatNlg', //jng
    'CkoOHqxF4oncn5cMXyGF4DQulREIoRB_OLvCsFdEPxJAA7b54rF_87CKEr0z6I2xCeCF4dWVGoyhiw', //jng/sup
    'NgxBqjGz8phs4sCsLMTxFMPldQqhdmlcIxzg3tw5kgHKkSsksEBqlhA0Cmj-E14uFvrRs3jbpMdcUw', //sup/adc
    '-BJqVLkiAjee1mK1YejqnhVxm-BNlzDB4diDTnChToMGXvyv9tYQK0jKPiDYkEBAOzU5zepyPRM-4g',
    '7HqSNvyKewotOmx2mfKREGLR6LSFGE9-kRvG21izpPNY6LC7dDlQ4HVcvmvewj5LY09TvF9SsvQJ3g',
    '5sje90_UCXzOWP0m2Qw8mP_VbzVRv8w9T4n2oztEma_vJeNy0PalRI9Osv8takvch91eqddM0BLrPg',
    'gwijJ2xZw5bo4mp7N1vIUoSYgiI3uc8RBeXCCkjpoPiyRt4NcI-nUkaQncbwBgHsYT929pitQZSk1Q', //mid/top
    'MErCV9QRnV8BHQHAOO_VmDVBbKGhrYz_syayObo1BLEpD96UneZrsBinMM7nKGxMlhkP11LOZmtnSw', // adc
  ],
  asia: [
    'WrhAJm4kPOMTmUqAKV-dy0AnTV1Zpv7xRFXHgzukqYQbRPhvQc1WhYoEgW1C-nnznnPUxIbVxFCIsA',
    'Dpwl_S3Qo4chKE2nLCMQoB_YsBJNeuNYO9KpTnIfk6yeiqm6-Ra--eDxPo467Vxf5ICY1RUkTB_4BQ',
    'qT9L0nbQklyolqelEukX50_8Q-xR_-DEkZQ_Revvp8K6MFrgxdHNd0lgtAAIleBtMH4rR1kAOhWrug',
    '1AvCDQZ6VVyGwVFOxB-rc7AiXXlL6arKa8FhrhoZN8OIbrpegGb6H1q_vhf-RABVefPbu8wyyTAN-Q',
    'i_rEKj4cfr5ePZUwwvIq2Fmt9Y454sY-5t-A9TFAbVt3iEhU3nbueF0Ho3X69Gj8O3wdXsKWlk523w',
    'QiHKrevEi-w76Er6uRxw2tnf96ns6uzvxVu7wd9KN6SKlLHd5hHGLhwv-ac1cIPmBOmw9dmSX2pmSg'
  ],
  americas: [
    'N2Kdl3K571_H9dhMKt3-kwcGSRGE8TWJ5CdycTBgHufZ_xXpaC78oyfJzzlRWne9yk4fj9TDCZlG3A',
    'GLpyuBoiwsEKxm1k21Ltzosw_hGVff1nWNsBLHqWAX6NZGCXeQQqN8rE-oxTeLOjOYvyf1vz0d-gxQ',
    'vs_-vx7mG54IfM4D9n_LXHKiXR5saJ--ODEDplzUXmYhbi5D09eiKvyCRcj_pMe_mSH1U-04kYPTEw'
  ],
};

const puuids = {
  europe: [
    'xRmu3V5RwlABzs3CE2Lb-YWVfZ1VmWHdZwIASiWW4iIqFvZtzjYzFih4FzYghlxumX8dr-6NH8V3SA',
    'vKms5dOw86Embvb6iWCCnr7_Dy5e9-_FPhIj9Nn1aJH-evj0_9hn8UXYWm-fgQ7mtb67q9Zb5T0DuA',
    'sooI3Hr5ZVbi_ykjfPZU-4zCkNDihNmO8hvthl753GqsHQkS8UJ2P8zpSson2_p66PSHDQaowJWNBQ',
    'gQTdFZTzprjqfDLG0PorKJKg70Cu3Ml-UVDwvoTcFz7RF87OH2xBIndm99oJ4bt4os80PhwWc3VJsA',
    'S08skx8mGfy5n3t1DQmpk7c1HEyZ4DTWdP7QRihpuB8x1ar2F7VPkz6tPkrXAMYpVbJGEOraP-qmJw',
    'JysYHFBmn97TSLD8P3i76SD4P75dySQSU0RBSvluVHj_ZieNHclo_ZBOLtPWCqA2-MfNFaUzARfqew',
    'r_IJRTtd645BXdXhNW0xM93jRHSxNLvlJcrN0u9MK2-U7hfSrzH8dubVWp5GhcCXEyr1_iECE2wJRw',
    'CRnPDN4l_qnwkl-t8Dcx6uJA9ND8dsvC6mA6cRwxmiKYVMYLFVkvTksmTP-jivdpcWGfyCzMNImv6A',
    'NGNSfnCdGbEMlQ7WJxcJZOnztED7OcFgEn9Om8uVGIHmu3CJApMoejS5daTlkuFmDdceHzBdwNinFw',
    'FvSASmJWz91qIclIM1VNImGKrO-A7ixd3r_KbWQ3POyE0fwdhS46R_TaIpDgAl5SAxRNoQvkwFDqAg',
    'w8bG0wQJMIpGq8Mi25w1ZW4Vg-f-uVTOr6gd9nE5iV_PIEHNwtWC405Ff9--VL8hUtsFFRBmqrOR5w',
    'xzKtzt2Y5HsoEzSeA3p71y1uhGgKWjHKW5OgRAPyyHA13W4N1RwI327Q_KVWMF5eze2LszcRUzM87g',
    'L0YTcv3mRCRgkcVq4gPYjWMg4kax0EDY9acnDuoJ74irnSXjj5gWs_CFrOzP7rqMxesC8_aCYWx4gA',
    'i2Wblfon3q3A9IJKmbqI5owNl8vcuuRTN_nlU_QgGs5kZkDPQZoSVdbeua0kkNO7zPUv0mYAYRzeAg',
    'SLxsQUitF7b9hFlMmgcKldR06EG8zsdvvXvhUiQX7_gxh2fnvjSU75j63rsmjJNpUT6vAytjFxblgQ',
    's4xZpXnxZwFS2CxCscPq1ajmjM8td2RZf7Bo-uEW5TYIxL9Co9qqOJdVDVu0JnWPgXrZRGNvp2YorQ',
    'PIkfwios2vCnYZ4RBgXerrcZjqVLTGlanLLCz7i0UKiTiIi4vRk3FRy2ZHt9yxRDZm2K_u70ZjZuzw',
  ]
}

const puuidsArr = Object.keys(puuids).reduce((res, region) => [
  ...res,
  ...puuids[region].map(puuid => ({ puuid, region }))
], []);

module.exports = {
  config,
  assignKey,
  logPort,
  routes,
  puuidsArr
};
