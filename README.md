This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

Currently the frontend is configured to run on `http://132.161.188.153:8000` as the BASE_URL in the API calls.
This URL is only for mobile and its corresponding command to run the backend is `python manage.py runserver 0.0.0.0:8000`

If you want to run it on the IOS simulator on your mac you need to navigate to `config.ts` in the project directory and
change the BASE_URL to `http://127.0.0.1:8000`. The corresponding command to run the backend through the other repo is `python manage.py runserver`
