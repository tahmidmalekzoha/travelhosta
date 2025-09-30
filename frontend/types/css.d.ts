// Type declarations for CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Global CSS imports (like globals.css)
declare module '*.css' {
  const content: any;
  export default content;
}
