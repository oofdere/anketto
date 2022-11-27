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

You can preview the production build with `npm run preview` or run it using a tool like `pm2`.

```bash
pm2 start build/index.js --name anketto
```

### Updating

```bash
git pull
npm i
npm run build
pm2 restart anketto
```

Updates to PocketBase and its schema must be done manually. The schema can be updated using the built-in import functionality. Make sure to back up the `pb_data` folder before any update/upgrade.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Technical stuff
### Project Structure

The project structure largely follows that of any SvelteKit project, using filesystem-based routing: https://kit.svelte.dev/docs/project-structure

What each file does is explained here: https://kit.svelte.dev/docs/routing

```
anketto/
├── build/ (created by end-user)
│   ├── index.js (entry point for deployment)
│   └── (this is where the output of "npm run build" lives)
├── pocketbase/ (created by end-user)
│   ├── pocketbase (executable)
│   └── pb_data/
│       └── (this directory is the one you should back up!)
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── [NameOfComponent].svelte
│   │   ├── private/
│   │   │   ├── hcaptcha.ts
│   │   │   ├── pocketbase.ts
│   │   │   └── (modules that should only run serverside)
│   │   └── public/
│   │       ├── localstorage.ts
│   │       ├── pocketbase.ts
│   │       ├── qrcode.ts
│   │       └── (modules that can run on the server or client)
│   └── routes/
│       ├── create/
│       │   ├── +page.server.ts
│       │   └── +page.svelte
│       └── poll/
│           ├── [id]/
│           │   ├── shar[e]/ ([e] because of a SvelteKit bug)
│           │   │   ├── (cohost) (paths with parantheses are ignored by router)
│           │   │   │   ├── cohost.ts
│           │   │   │   ├── embed.css
│           │   │   │   ├── embed.html
│           │   │   │   └── prechoster.html
│           │   │   ├── +page.svelte
│           │   │   └── +page.ts
│           │   ├── vote/
│           │   │   ├── +page.server.ts
│           │   │   ├── +page.svelte
│           │   │   └── +page.ts
│           │   ├── +layout.svelte
│           │   └── +page.ts
│           ├── +layout.svelte
│           └── +page.svelte  
├── static/
│   └── favicon.png
├── .env (created by end user)
├── Caddyfile (contains config for Caddy web server)
├── package.json
├── pocketbase.config.json
├── postcss.config.cjs
├── svelte.config.js
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts
```

### Decisions
#### QR code generation
I looked around quite a bit for a decent QR generation library but couldn't find much. Initially I had wanted to use Symbology, but it hasn't been updated in a while and is incompatible with Node 18, so that was a bust. Eventually, I found a generator by Nayuki (https://www.nayuki.io/page/qr-code-generator-library) which I minimally modified to work as a Typescript module.

#### Database
At first I had intended to use a database directly, like SQLite, but decided against it when researching how to implement real-time updates, and instead looked into PaaS options. I wanted the project to be easy to self-host on any computer, so the big plartforms were out: Firebase is proprietary and requires a Google Cloud account, and Supabase requires Docker to self-host. I decided to use PocketBase because of its simplicity, requiring only a single Go executable to run.

#### Captcha
A Captcha was a must because it would be trivial to automate votes without one. However, I didn't want to increase complexity by creating a captcha system or including an external self-hosted option, so between reCaptcha and hCaptcha, I chose hCaptcha because I liked their docs more.

#### Server-side validation
There is none. I decided against it due to the added complexity, both programming wise and legally with GDPR and CCPA considerations. Instead, all completed polls are logged clientside in `localStorage`, and the client refuses to allow access to the voting page if voting has already taken place. Voting without JavaScript is impossible, due to the captcha requirement, so this along with hCaptcha should deter most duplications that would be deterred via cookies or IP blocking, both of which can easily be bypassed and can degrade the experience for legitimate users.

#### Svelte & SvelteKit
Svelte being reactive is extremely convenient for realtime updates, which I implemented using Svelte stores. I also implemented `localStorage` access through stores. I also like that Svelte doesn't have a runtime to bundle, which would be a waste of bandwidth and memory.