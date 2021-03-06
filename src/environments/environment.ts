// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  ENV: 'DEBUG',
  API_ENDPOINT_DEBUG : 'http://localhost:3000/api/',
  API_ENDPOINT_PROD : 'https://trackapio.herokuapp.com/api/',
  API_ENDPOINT_HOMOLOG: 'https://trackapio.herokuapp.com/api/'
};
