# Documentation

This documentation is powered by the [Docusaurus](https://docusaurus.io/) framework.

## Installation

- Open your IDE in `./docs-source` directory and run the following commands:

```shell
npm install
npm start
```

Then visit the URL http://localhost:4000/feedzback/.

## Contribute

The documentation is written in markdown files located in the `docs-source/docs` directory.

New files must be referenced in `docs-source/sidebars.ts` file in order to be visible in the final documentation.

## Build & deploy

The documentation is built in `docs` directory (at the root of the repository) and deployed on GitHub pages.

- To build the doc, run the following command:

```bash
npm run build
```

- The documention is deployed automatically on every commit to the `main` branch.
  For details, see the [GitHub pages settings](https://github.com/Zenika/feedzback/settings/pages).

Finally, visit the URL https://zenika.github.io/feedzback/ to see the online documentation.

## Update

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
    - install package: `remark-deflist`
    - install package: `@fontsource/nunito`
    - modify build script: `"build": "docusaurus build --out-dir ../docs"`
