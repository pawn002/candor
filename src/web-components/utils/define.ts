/**
 * `@customElement` with a duplicate-registration guard (#257).
 *
 * Lit's decorator calls `customElements.define()` unconditionally, and the
 * registry throws on a name it already holds. Inside a barrel import that throw
 * aborts the module graph part-way, so the page is left with every element
 * before the collision registered and every element after it silently inert —
 * one error in the console and a half-upgraded UI. That is what a consumer
 * migrating off its own `candor-*` primitives hit, and it made adopting the
 * package one component at a time impossible.
 *
 * So a tag that is already registered is skipped with a warning naming it,
 * and the rest of the import carries on. The existing definition wins, because
 * it is the one the page has already upgraded elements with — replacing it is
 * not something the registry allows anyway.
 *
 * The same guard covers loading Candor twice, e.g. the standalone bundle on a
 * page that also imports the ESM build. That is still a mistake (two copies of
 * every class), which is why it warns rather than passing silently.
 *
 * Same name and shape as Lit's decorator, so the Custom Elements Manifest
 * analyzer and the repo's `@customElement('candor-…')` source scans treat it
 * exactly as they treat Lit's.
 */
export const customElement =
  (tagName: string) =>
  (classOrTarget: CustomElementConstructor, context?: ClassDecoratorContext): void => {
    const define = () => {
      const existing = customElements.get(tagName);
      if (existing === undefined) {
        customElements.define(tagName, classOrTarget);
      } else if (existing !== classOrTarget) {
        console.warn(
          `[candor] <${tagName}> is already registered by another definition, so Candor's was skipped. ` +
            'Elements with this tag keep the existing definition. Rename the other element, or load Candor only once.',
        );
      }
    };
    // Standard decorators hand over a context and define at class initialisation;
    // legacy (experimentalDecorators, which this repo compiles with) call directly.
    if (context !== undefined) context.addInitializer(define);
    else define();
  };
