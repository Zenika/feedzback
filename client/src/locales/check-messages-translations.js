const { readFile, writeFile } = require('node:fs/promises');
const { join } = require('node:path');

const FRENCH_FILE_NAME = 'messages.fr.json';
const ENGLISH_FILE_NAME = 'messages.en.json';

const readMessages = async (fileName) => {
  const filePath = join(__dirname, fileName);
  try {
    const messages = JSON.parse(await readFile(filePath, 'utf8'));
    return { filePath, messages };
  } catch {
    console.error(`A file is missing: ${filePath}`);
    process.exit(1);
  }
};

const consolidateTranslations = async (fileName, addTranslationsKeys = [], removeTranslationsKeys = []) => {
  const { filePath, messages } = await readMessages(fileName);

  addTranslationsKeys.forEach((key) => (messages.translations[key] = '[ MISSING TRANSLATION ]'));
  removeTranslationsKeys.forEach((key) => delete messages.translations[key]);

  messages.translations = Object.fromEntries(
    Object.entries(messages.translations).sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0)),
  );

  await writeFile(filePath, JSON.stringify(messages, undefined, 2) + '\n', 'utf8');
};

const compareEnglishAndFrenchTranslationsKeys = async () => {
  const frenchTranslations = new Set(Object.keys((await readMessages(FRENCH_FILE_NAME)).messages.translations));
  const englishTranslations = new Set(Object.keys((await readMessages(ENGLISH_FILE_NAME)).messages.translations));

  const englishMissingKeys = [];
  frenchTranslations.forEach((key) => englishTranslations.has(key) || englishMissingKeys.push(key));

  const englishUselessKeys = [];
  englishTranslations.forEach((key) => frenchTranslations.has(key) || englishUselessKeys.push(key));

  if (englishMissingKeys.length || englishUselessKeys.length) {
    console.warn(`
Warning:
\tEnglish translation keys (${ENGLISH_FILE_NAME}) do not match French ones (${FRENCH_FILE_NAME}):`);
    if (englishMissingKeys.length) {
      console.warn('Missing keys:', englishMissingKeys);
    }
    if (englishUselessKeys.length) {
      console.warn('Useless keys:', englishUselessKeys);
    }
  }

  await consolidateTranslations(ENGLISH_FILE_NAME, englishMissingKeys, englishUselessKeys);
};

const run = async () => {
  await consolidateTranslations(FRENCH_FILE_NAME);

  await compareEnglishAndFrenchTranslationsKeys();
};

run();
