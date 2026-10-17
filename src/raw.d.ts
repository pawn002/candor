// Vite's `?raw` suffix imports a file's text. Documentation stories use it to
// read token source directly, so a displayed value is derived, never copied.
declare module '*?raw' {
  const text: string;
  export default text;
}
