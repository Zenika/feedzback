const { readFile, writeFile } = require('node:fs/promises');
const { join } = require('node:path');

const consolidateMessagesTranslations = async (fileName, addKeys = [], removeKeys = []) => {
  const messagesPath = join(__dirname, fileName);
  const messages = JSON.parse(await readFile(messagesPath, 'utf8'));

  addKeys.forEach((key) => (messages.translations[key] = ''));
  removeKeys.forEach((key) => delete messages.translations[key]);

  const sortedTranslationEntries = Object.entries(messages.translations).sort(([a], [b]) =>
    a > b ? 1 : a < b ? -1 : 0,
  );
  messages.translations = sortedTranslationEntries.reduce((translations, [sortedKey, value]) => {
    translations[sortedKey] = value;
    return translations;
  }, {});

  await writeFile(messagesPath, JSON.stringify(messages, undefined, 2) + '\n', 'utf8');
};

const compareMessagesTranslations = async () => {
  const frenchMessages = new Set(
    Object.keys(JSON.parse(await readFile(join(__dirname, 'messages.fr.json'), 'utf8')).translations),
  );
  const englishMessages = new Set(
    Object.keys(JSON.parse(await readFile(join(__dirname, 'messages.en.json'), 'utf8')).translations),
  );

  const englishMissingKeys = [];
  frenchMessages.forEach((key) => englishMessages.has(key) || englishMissingKeys.push(key));

  const englishUselessKeys = [];
  englishMessages.forEach((key) => frenchMessages.has(key) || englishUselessKeys.push(key));

  if (englishMissingKeys.length || englishUselessKeys.length) {
    console.warn(
      '\nWarning:\n\tEnglish messages (messages.en.json) not aligned with French messages (messages.fr.json):',
    );
    if (englishMissingKeys.length) {
      console.warn('Missing keys:', englishMissingKeys);
    }
    if (englishUselessKeys.length) {
      console.warn('Useless keys:', englishUselessKeys);
    }
  }

  await consolidateMessagesTranslations('messages.en.json', englishMissingKeys, englishUselessKeys);
};

const run = async () => {
  await consolidateMessagesTranslations('messages.fr.json');

  await compareMessagesTranslations();
};

run();
