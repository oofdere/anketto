# Anketto
Twitter polls, without Twitter.

## Setup
You should have the latest version of Node and an instance of Pocketbase installed.

First, clone the repository or download the release you'd like to use, then update the dependencies.

```bash
# download anketto
git clone "https://github.com/oofdere/anketto"
cd anketto

# create a new project in my-app
npm i
```

Create a .env file using the following variables:
```
PUBLIC_POCKETBASE_URL = "http://127.0.0.1:8090"
SECRET_POCKETBASE_USERNAME = "pocketbase email"
SECRET_POCKETBASE_PASSWORD = "pocketbase password"
SECRET_HCAPTCHA_KEY = "0x0000000000000000000000000000000000000000"
PUBLIC_HCAPTCHA_SITE_KEY = "10000000-ffff-ffff-ffff-000000000001"
```

Import `pocketbase.config.json` into Pocketbase or manually create the `polls` table. Make sure to set the view rule on the table to public.

### Developing
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Deployment
To build for production:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
