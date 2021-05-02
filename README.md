## React-i18next demo 

Demo of the `react-i18next` library with using react wit hssr.

⚠️  **This is not meant for production use**

#### Sections

1. [Motivation](#motivation)
2. [Getting Started](#getting-started)
3. [Task](#task)
4. [Technologies](#technologies)
5. [Notes](#notes)

#### Motivation


Demo the library `react-i18next`. Mainly to experiment with the `react-i18next` for scalable i18n strategy.

**Main benefits:**

- Strategy for scaling, splitting and managing translation files (code splitting / lazy loading)
- Great tooling for file extraction, debugging
- Excellent Documentation & community
- Supports React but is framework agnostic

#### Getting Started

**Common packages:**

In root folder run:
```
yarn run build
```

**client:**
```sh

cd ./services/client
yarn start
```

**server:**
```sh
cd ./services/server
yarn server:watch
```

visit http://localhost:3001

#### Tasks

List of things to explore and experiment with.

- [ ] Independent release and sync with translation files (publish and versioning)
- [ ] Edge distrubtion (AWS cloudfront and s3) 
- [x] SSR with react & react-i18next 
- [ ] i18n file extraction with tooling [link](https://react.i18next.com/guides/extracting-translations)
- [x] Integrating npm package with i18n using `react-i18next`
    - i.e. some UI with i18n (how to handle extraction and loading locally and in production)

### Technologies

#### Client

- create-react-app 
- react / react-dom 
- react-router
- material-ui
- react-i18next
- i18n-http-backend 

#### Server 
- express
- http-proxy
- webpack
- react / react-dom 
- nodemon
- pug (templating)
- react-router
- material-ui
- i18n-http-backend 

### Notes

1. Using `i18n` & `react-i18next` across npm packages

There is a weird caveat with `react-i18next` if you initialize this across packages it uses different versions.

Therefore, if you try to load it in your main app then try to use it in your component library, the Translations won't exists as they are referencing two different versions and instances.

**My work around is to create a `@common/i18n` does the following:**

- Create the `i18n` instance and export it
- Export the `react-i18next` imports

Re-using this across the packages in the mono-repo ensures we only reference and use one version of the `i18n` and `react-i18n`.

**Similiar Discussions:**
- [react-i18n issue #788](https://github.com/i18next/react-i18next/issues/788)
