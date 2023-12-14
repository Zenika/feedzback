export const buildHtmlPage = (lang: string, title: string, body: string) => {
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" />

    <style>
      body {
        max-width: 720px;
        margin: 0 auto;
        padding: 1rem;
        font-family: 'Nunito', sans-serif;
      }
    </style>
  </head>
  <body>
${body}
  </body>
</html>`;
};
