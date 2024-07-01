export const buildTextMatrix = (value?: string) => {
  return (value ?? '')
    .replaceAll(/\n{3,}/g, '\n\n')
    .split('\n\n')
    .map((paragraph) => {
      const content = paragraph.trim();
      if (!content) {
        return [];
      }
      return content.split('\n');
    })
    .filter((multiLineParagraph) => multiLineParagraph.length > 0);
};
