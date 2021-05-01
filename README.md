## React-i18next demo 

Demo of the `react-i18next` library with using react wit hssr.

⚠️  **This is not meant for production use**

#### Sections

1. [Motivation](#motivation)
2. [Getting Started](#getting-started)
3. [Task](#task)
4. [Technologies](#technologies)


#### Motivatioj


Demo the library `react-i18next`. Mainly to experiment with the `react-i18next` for scalable i18n strategy.

**Main benefits:**

- Strategy for scaling, splitting and managing translation files (code splitting / lazy loading)
- Great tooling for file extraction, debugging
- Excellent Documentation & community
- Supports React but is framework agnostic

#### Getting Started

**client:**
```sh
yarn start
```

**server:**
```sh
yarn server:watch
```

visit http://localhost:3001

#### Tasks

List of things to explore and experiment with.

- [ ] Independent release and sync with translation files (publish and versioning)
- [ ] Edge distrubtion (AWS cloudfront and s3) 
- [x] SSR with react & react-i18next 
- [ ] i18n file extraction with tooling [link](https://react.i18next.com/guides/extracting-translations)
- [ ] Integrating npm package with i18n using `react-i18next`
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
