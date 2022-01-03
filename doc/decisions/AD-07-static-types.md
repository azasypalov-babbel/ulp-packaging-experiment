# AD-07: Static types in lesson-player.spa

- _Creation_: 2021-09-20
- _Deciders_: @lessonnine/r2d2
- _Last Review_: 2020-09-23
- _Reviewers_: @beanqueen, @Marcel-G, @Simba14
- _Status_: ACCEPTED
- _Domain Group_: @lessonnine/r2d2

## Context

The lesson-player.spa codebase is large, complex and a critical part of the Babbel experience. It is set to serve lessons to all learners across web, iOS and Android. We require a very high level of confidence with this project, one way to be more confident about the code is by adding static types. This is especially important when it comes to mobile releases, as our ability to correct issues post-release is very limited.

The main motivations for adding static types:

- Increase code predictability, readability and documentation.
- Bring Babbel’s content model into code so that we can be more consistent with how the lesson-player.spa interacts with other parts of Babbel’s infrastructure.
- Using types as a means to document and validate the code we write so that it is easier for new team members to understand and for R2D2 to maintain.
- Catching data flow bugs in component compositions.

There’s multiple avenues and technologies to achieve this, **here we decide on what technology to use and a plan on how to execute the migration.**

Note: This decision will not impact legacy code (b3) that should remain unchanged.

## Decision Criteria

We would like to have the ability to _add types incrementally_ where it gives us the most benefit, and enable the benefits of type annotations _without too much disruption to the codebase_ _and our current objectives_.

- Amount of additional workload
- Migration complexity
- Acceptance by R2D2 engineers

# Possible Solutions

## 1. Using JSDOC for static types

Use JSDOC as a means to add static types without the need for a compile step. This has the advantage that no major change is needed to the current code or build process of the project. That approach is outlined in these four proposal PRs:

- [[1] Types proposal - Base](https://github.com/lessonnine/lesson-player.spa/pull/3150)
- [[2] Types proposal - Normalisation](https://github.com/lessonnine/lesson-player.spa/pull/3151)
- [[3] Types proposal - Markup](https://github.com/lessonnine/lesson-player.spa/pull/3153)
- [[4] Types proposal - Tracking](https://github.com/lessonnine/lesson-player.spa/pull/3154)

**Pros:**

- Easy to incrementally add static types and benefit from static type features during development & at build time.
- No changes required to the build process of the lesson-player.spa
- Helps to leverage engineers understanding of the code by great tool support via [tsserver](https://github.com/Microsoft/TypeScript/wiki/Standalone-Server-%28tsserver%29)

**Cons**

- Type annotations are cumbersome with JSDOC as it’s a different syntax to TypeScript. This means yet another syntax to learn and it’s not as widely used as TypeScript.
- Types that also double as values are not usable in application logic, for example, TypeScript enums are both types and values and when compiled can be used in application logic. JSDOC enums are simply annotations and therefore extra work is needed to define the corresponding values in JS.
- Using JSDOC as an intermediate step to TypeScript is not useful as there is no good solution for converting JSDOC annotations to TypeScript later on.

## 2. Full TypeScript implementation

Transition directly to TypeScript. This is more involved as it will affect the build process of the application.

Note: Other alternatives (eg. [flow](https://flow.org/)) are not considered here as TypeScript is already established in R2D2 ([lessonnine/lesson-content.microverse](https://github.com/lessonnine/lesson-content.microverse), [lessonnine/babbel-markup-helper.js](https://github.com/lessonnine/babbel-markup-helper.js)) and the wider engineering department see .

**Pros:**

- Allows exposure of APIs with **typed interfaces** as contracts to simplify integration in consuming projects in the future
- Helps to leverage engineers understanding of the code by great tool support via [tsserver](https://github.com/Microsoft/TypeScript/wiki/Standalone-Server-%28tsserver%29)
- Early integration of ES-next features and transpiling
- engineers experience: attracting potential new joiners and keeping existing ones happy

**Cons:**

- Medium to big initial learning curve and knowledge sharing needed
- Higher barrier to contribution (TypeScript is a superset, and thus requires extra knowledge on top of the regular JavaScript knowledge, the learning curve can be steep for engineers without a background with a typed language)
- Recurrent knowledge sharing around more advanced topics needed
- Initial effort in setup and (potential) adaptation of existing integrations
- Extra compile step performance, eg. unit tests could take considerably longer.

## 2.1 Automated TypeScript migration

Use automated tooling to do the grunt work of the migration and follow-up with adjustments as we touch files. For consistency, and reduction of manual work with the migration, the recommendation is to convert the entire project to TypeScript with as much automated assistance as possible.

There are several tools for automated migration that we can possibly explore [see here](https://react-typescript-cheatsheet.netlify.app/docs/migration/from_js#automated-js-to-ts-conversion)

**Pros:**

- Produce a consistent result across many files
- Allows us to convert the entire project from JavaScript to TypeScript in an afternoon.
- Automated scripts take care of the busy work of the migration (this saves us time).

  - Renaming files from js to ts / tsx
  - Adding types where possible
  - Converting prop-types to TypeScript types

  **Cons:**

- It is possible that this automated step can misunderstand or mangle code in an undesired way. To mitigate this, these cases should be identified and fixed in master before the final migration. This process would involve repeating the above migration several times, observing the output, resolving issues in master and repeating until we reach the desired state.
- The initial test for this migration process introduced a significant amount of eslint warnings. We’ll likely need to fine tune the config or migration process to reduce this number as much as possible.
- The automated process will add in `// @ts-expect-error ts-migrate()` comments where it was unable to determine types or where type issues were found. We’ll need to build a process around resolving these issues as we touch these parts of the code.
- While the migration process is “in-progress” we need to be mindful of future-deployments. Eg: not merge to master new changes until the migration is completed to eliminate different sources of possible defects, to avoid merge conflicts, and “diff”-ing difficulties.

## 2.2 Incremental 'scouts rule' TypeScript migration

Keep the project as predominantly JavaScript but change the configuration in such a way to support both JavaScript and TypeScript. As we touch files we manually convert them to TypeScript - 'scout rule'.

**Pros:**

- The quality of the types will be greater as each file will go through proper code-review before merge to master
- Incremental approach would assist the team with gradual learning

**Cons:**

- Adds more work to be done during the sprint by engineers
- Manual changes would be inconsistent regarding patterns since the work would be carried out over a longer timeframe and by different engineers.

## 2.3 Incremental 'scouts rule' TypeScript migration with some automation

Keep the project as predominantly JavaScript but change the configuration in such a way to support both JavaScript and TypeScript. Using automated tools to do the busy migration work (see 2.1) and polish the migration manually before merging.

**Pros:**

- The quality of the types will be greater as each file will go through proper code-review before merge to master
- Automated scripts take care of the busy work of the migration (this saves us time).
  - Renaming files from js to ts / tsx
  - Adding types where possible
  - Converting prop-types to TypeScript types
- Incremental approach would assist the team with gradual learning

## 3. No changes

Keeping the lesson-player.spa as it is, using PropTypes.

**Pros:**

- Lower barrier to contribution to the project (all Front-end engineers work with JavaScript)

**Cons:**

- We don’t achieve the goal of static types in the lesson-player
- We miss out a great opportunity on learning the potential advantages on growing apps and use optional type inference
  - With PropTypes data flow/type checking happens only on component level, expensive to make type changes, that affect multiple components, leave space for human errors in defining types

# Recommendation

The recommendation would be to adopt an Incremental 'scouts rule' TypeScript migration with some automation (see 2.3).

We would set up engineering agreements for working with TypeScript after that initial migration:

- Engineers should aim to migrate all (within reason) files they touch to typescript with the help of an automated tool as well as some manual effort.
- Engineers that are not confident with TypeScript should be supported by a peer via pair programming. If that is not feasible, pull-requests can be submitted without types and a peer can assist at a later time / during code review.
- Learning time / knowledge sharing around TypeScript should be arranged

# Decision

We have decided to go with approach 2.3. In preparation for the scouts rule migration we will plan the work to achieve the base level of type coverage needed in the application. These are:
1. Initial configuration to have TS/JS in the same project.
2. Working agreements for working with TypeScript and the migration.
3. Types installed for dependencies.
4. Type definition for the internal application models (Lesson, Trainer, Item, etc) as they are used currently.
5. Type definitions for services (Babbel API responses) and Redux stores.

During this phase the goal is to increase the type coverage without modifying the logic of the application too heavily.
Once we have this base level of type coverage, we can start migrating the files we touch.

