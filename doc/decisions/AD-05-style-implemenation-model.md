# AD-05: Style implementation model
- *Creation*: 2018-10-12
- *Deciders*: Alexander Gudulin, Laurens Nienhaus, Alexander Odell, Davide Ramaglietta, Jayasurian Makkoth, Noelia Cabane
- *Last Review*: 2018-10-12
- *Reviewers*: Alexander Odell, Davide Ramaglietta
- *Status*: PROPOSAL

## Related

[Comparison of CSS technologies](https://confluence.internal.babbel.com/wiki/display/PM/CSS+modules+and+Styled+Components) This document is to compare other technologies to create and maintain CSS in an extendable, modular and independent way.

## Context

We want to implement a style model providing the following features:

- Support for replacing individual components in the codebase
- Component scoped styles
- Self-contained components: a component should contain all the required rules for rendering the desired result
- Brand consistency among components
- Inheritance for composition: shared styles defined for one component
- Package management: plug and play functionality, importing a component, no extra build steps required for consumer
- High speed of development

## Possible Solutions

 - Current stack with SASS

The combination of BEM, SASS, and React covers some of the needs listed in the Context section. However, this stack requires significant manual work from developers to achieve component scoped styles.

- CSS Modules

CSS Modules covers most of the requirements but needs more effort by the developer to name classes, bind to components, and create themes. In addition to that, it lacks enough official set-up documentation and hasn't been maintained recently.

- CSS in JS, particularly `styled-components` library

Styled Components fulfills all the requirements listed in the Context section.


## Decision

The decision is in favor of Styled Components.
This library has other advantages over similar CSS in JS libraries:

- It speeds up the development by freeing the developer from class name management.

- Has a more significant community than CSS Modules and other CSS-in-JS libraries. This support makes it more reliable for the long run.

- Styled Components doesn't support the extraction of CSS into a static file. We would move forward with this decision, acknowledging this technical limitation for optimization. In the early stage of the development cycle, package management is more relevant than CSS micro-optimization.

## Consequences

Current SASS implementation will be gradually replaced by styled components.

The style for new components of the application will be implemented following the styled components approach.
