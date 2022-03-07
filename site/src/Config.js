export async function config() {
  const data = await fetch('./config.json').then((response) => response.json());

  const AmplifyConfig = {
    API: {
      endpoints: [
        {
          name: 'demoApi',
          endpoint: data.API_URL,
        },
      ],
    },
  };

  return AmplifyConfig;
}
