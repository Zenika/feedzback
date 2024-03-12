# FeedZback - Documentation

This documentation is built with [Docusaurus](https://docusaurus.io/).

## How to develop?

The documentation is written in markdown files located in the `docs-source/docs` directory.

New files must be referenced in `docs-source/sidebars.ts` file in order to be visible in the final documentation.

- To launch the doc locally, run the following command:

```bash
npm start
```

## How to build?

The documentation is built in `docs` folder (at the root of the repository) and deployed using [GitHub pages](https://zenika.github.io/feedzback/).

- To build the doc, run the following command:

```bash
npm run build
```

## How to update Docusaurus?

- You can [manually change the version number](https://docusaurus.io/docs/installation#updating-your-docusaurus-version) in `package.json` to the desired version.

- You can also start with a [clean install](https://docusaurus.io/docs/installation#scaffold-project-website) of Docusaurus and then restore:
  - `./blog` directory
  - `./docs` directory
  - `./src` directory
  - `./static` directory
  - `./.prettierignore` file
  - `./.prettier.json` file
  - `./docusaurus.config.ts` file
  - `./sidebars.ts` file
  - `./package.json`
    - intall package: `@fontsource/nunito`
    - modify build script: `"build": "docusaurus build --out-dir ../docs"`
