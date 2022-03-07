const config = async () =>
  await fetch('./config.json').then((response) => response.json());

export const AmplifyConfig = {
  API: {
    endpoints: [
      {
        name: 'demoApi',
        endpoint: config.API_URL,
      },
    ],
  },
};
