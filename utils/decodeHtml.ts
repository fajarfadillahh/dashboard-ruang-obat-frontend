export function decodeHtmlEntities(str: string) {
  return str
    .replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    })
    .replace(/&([a-zA-Z]+);/g, (match, entity) => {
      const entities = {
        lt: "<",
        gt: ">",
        amp: "&",
        quot: '"',
        apos: "'",
        // Tambahin lagi kalo ada yang lain
      };
      return entities[entity] || match;
    });
}
