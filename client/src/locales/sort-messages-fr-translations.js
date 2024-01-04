const { readFile, writeFile } = require('node:fs/promises');
const { join } = require('node:path');

const sortMessagesTranslations = async () => {
  const messagesPath = join(__dirname, 'messages.fr.json');
  const messages = JSON.parse(await readFile(messagesPath, 'utf8'));

  const sortedTranslationEntries = Object.entries(messages.translations).sort(([a], [b]) =>
    a > b ? 1 : a < b ? -1 : 0,
  );
  messages.translations = sortedTranslationEntries.reduce((translations, [sortedKey, value]) => {
    translations[sortedKey] = value;
    return translations;
  }, {});

  await writeFile(messagesPath, JSON.stringify(messages, undefined, 2) + '\n', 'utf8');
};

sortMessagesTranslations();
