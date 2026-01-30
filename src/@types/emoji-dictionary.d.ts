declare module "emoji-dictionary" {
  const emoji: {
    getUnicode(name: string): string;
    getName(unicode: string): string | null;
  };
  export default emoji;
}
