# Content Model

Describes the important entities in this domain.
For details on the Babbel's content model outside of this domain see [documentation here](https://doc.babbel.com/lessonnine/guides.doc/domain/content.html).

> :bulb:	This document is aligned to the v3 graph converter output. See [Trainer Space 2020](https://docs.google.com/spreadsheets/d/1AWnR3br9nQX0HvSCSLjIyaJc3VaAh3bo6mnA5qXmKvM/edit#gid=1328457760)

- [Lesson Data](#lesson-data)
- [Babbel Markup](#babbel-markup)
  - [Markup](#markup)
  - [Scripting](#scripting)
    - [wordorder](#wordorder)
    - [puzzlehelper, write](#puzzlehelper-write)
    - [choose](#choose)
    - [speak](#speak)

# Lesson Data

Lessons are authored in the CAT tool. They are then converted to a different format via [lessonnine/graph.converters](https://github.com/lessonnine/graph.converters). The lesson-player.spa consumes that output via an API call to [lessons endpoint](https://swagger.babbel.com/babbel-production).

The data returned by the lesson endpoint is defined in the lessonnine/babbel.apigateway repository. See [remote_lesson](https://github.com/lessonnine/babbel.apigateway/blob/master/api/content/_shared/models/remote_lesson.yml).

> :eyes:	Currently, the definition above does not distinguish between API versions and is therefore not the most reliable information right now. The best way to keep track of changes is to follow the development of the new version.

The model described below closely resembles what the lesson API provides. This exact model however, is internal to the lesson-player and therefore can be modified to best suit our needs with custom mappings.

```typescript
/**
 * Contains interactive elements scripted by editors.
 * The parsing of those elements is determined by the a trainers interaction.
 */
export type ScriptedString = string;

/**
 * Contains markup for visual text emphasis.
 */
export type MarkupString = string;

interface Lesson {
  id: string;
  trainers: Trainer[];
}

interface Trainer {
  dictate: boolean;
  image: TrainerImage;
  interaction: TrainerInteraction;
  itemGroups: ItemGroup[];
  title: MarkupString;
  translationVisibility: TrainerTranslationVisibility;
  type: TrainerType;
}

interface TrainerImage {
  id: string;
}

enum TrainerType {
  Card = "card",
  Conjugation = "conjugation",
  Comprehension = "comprehension",
  Cube = "cube",
  Dialog = "dialog",
  Dictate = "dictate",
  Groupsort = "groupsort",
  Keyboard = "keyboard",
  Matching = "matching",
  Memory = "memory",
  Sortlist = "sortlist",
  Table = "table",
  Textdictate = "textdictate",
  Wordorder = "wordorder",
  Writingexercise = "writingexercise",
  Vocabulary = "vocabulary",
}

interface ItemGroupImage {
  id: string;
}

/**
 * Item groups are used to separate logical sequences of items. This concept appears to be an artefact of a previous content conversion project.
 * In practice, most of the trainers we support do not require this separation and only contain a single group of items.
 *
 * Of the trainers relevant to us there are just two that make use of this separation. `TrainerType.Keyboard` & `TrainerType.Comprehension`.
 *
 * https://github.com/lessonnine/graph.converters/blob/9204501fd95b633c7730592afab6dab5cf1fe6e5/src/helpers/item_groups.js#L146
 */
interface ItemGroup {
  image: ItemGroupImage;
  items: Item[];
  title: string;
}

interface Item {
  displayLanguageText: ScriptedString;
  id: string;
  image: ItemImage;
  infoText: MarkupString;
  learnLanguageText: ScriptedString;
  sound: ItemSound;
  speakerRole: ItemSpeakerRole;
  type: ItemType;
}

interface ItemSound {
  id: string;
}

interface ItemImage {
  id: string;
}

/**
 * Types `Phrase` and `Task` determines if `Item.learnLanguageText` or `Item.displayLanguageText` is the actionable field of an Item respectively.
 *
 * Note: `ItemType` does not determine if an item is interactive or non interactive, that is determined by the presence of `Interactive Element`s in `ScriptedString`.
 *
 */
enum ItemType {
  Phrase = "phrase",
  Task = "task",
}

enum ItemSpeakerRole {
  None = "None",
  N1 = "N1",
  M1 = "M1",
  M2 = "M2",
  F1 = "F1",
  F2 = "F2",
}

enum TrainerTranslationVisibility {
  Full = "full",
  Partial = "partial",
  None = "none",
}

enum TrainerInteraction {
  Choose = "choose",
  Show = "show",
  Speak = "speak",
  Write = "write",
  Click = "click",
  Wordorder = "wordorder",
  Puzzlehelper = "puzzlehelper",
}

/**
 * Represents the language a user intends to learn.
 */
enum LearnLanguageAlpha3 {
  DAN = "DAN",
  DEU = "DEU",
  ENG = "ENG",
  FRA = "FRA",
  IND = "IND",
  ITA = "ITA",
  NLD = "NLD",
  NOR = "NOR",
  POL = "POL",
  POR = "POR",
  QMS = "QMS",
  RUS = "RUS",
  SPA = "SPA",
  SWE = "SWE",
  TUR = "TUR",
}
```

# Babbel Markup

Babbel markup is a special syntax with two main functions. The syntax features can be found here [Babbel Markup](https://confluence.internal.babbel.com/display/PM/Babbel+Markup).

1. Markup - seen above as `MarkupString` - used to describe visual emphasis on text.
2. Scripting - seen above as `ScriptedString` - defines interactive elements in `Item.leanLanguageText`.

> :eyes:	No such distinction exists in the project Today and that leads to confusion. Let's be sure to keep `ScriptedString` and `MarkupString` as separated as possible.

In order to work with these strings we use [lessonnine/babbel-markup-helper](https://github.com/lessonnine/@lessonnine/babbel-markup-helper.js). The details of this package are also not well understood / documented yet we use it to derive the following information:

- Normalisation of Babbel markup. In some cases we have the need to render the `Item.learnLanguageText` to the screen without markup.
- Derive the "interactive elements" specified by the editors. (`ScriptedString`)
- Transform text emphasis into HTML. (`MarkupString`)

There are 4 other implementations:

- [iOS](https://github.com/lessonnine/core.ios/blob/8cfa7a17680e38325bd5068f6ed09e7b70b5a3fb/common.module.ios/Common/Parsing/ContentMarkupParser.swift#L5)
- [Android](https://github.com/lessonnine/core.android/blob/3b0ffb382c4c39f54d4f46c327e4d0d9fcbda212/presentation/lessonplayer/src/main/java/com/babbel/mobile/android/core/lessonplayer/util/contentparser/ContentMarkupParser.kt#L15)
- [Python](https://github.com/lessonnine/recommendation.microverse/blob/c4a0cedc981fbea40cee4d5e6a80b2caf1812d35/recommendations/models/babbel_markup.py#L7)
- [Ruby](https://github.com/lessonnine/babbel_markup_parser.gem) being the reference implementation

## Markup

`MarkupString` describes visual text emphasis (eg, `<strong>` & `<em>` in HTML). This can appear in `Trainer.title`, `Item.displayLanguageText` & `Item.infoText`.
It can also be applied around parsed interactive elements in a `ScriptedString`.

See more detail about [Markups in Titles, Interactions & Combination](https://confluence.internal.babbel.com/pages/viewpage.action?pageId=186949289).

## Scripting

`ScriptedString` describes interactive elements and appears only in `Item.learnLanguageText` or `Item.displayLanguageText`.

There is already some information about what editors expect in terms of scripting in [Scripting examples per Trainer Type](https://confluence.internal.babbel.com/display/DQA/Scripting+examples+per+Trainer+Type).

Parsing of this string is determined by the interaction. See `TrainerInteraction` for the possible interactions.

We're interested in the following parts of the scripting:

- `Interactive Element`: Scripted element requiring user interaction.
- `Element`: Scripted element not requiring user interaction.
- `Distractor`: value presented to the user that is not accepted as correct.
- `Target`: value accepted as correct (marked with `*`).

Below is some examples of how `ScriptedString`s might look like for certain interactions and how they map to the above terminology.
The description is about what to expect from the data. To understand how an interaction should work, refer to the specification.

### wordorder

Wordorder comes as a series of interactive elements, each with a single target. There cannot be multiple targets for an element. The item can only consist of interactive elements. Spaces may or may not exist between the interactive elements.
Distractors are derived from the adjacent interactive elements.

(Example of wordorder)

```
> learnLanguageText: '((Une)) ((maison)) ((écologique,)) ((c'est)) ((ce dont)) ((j'ai)) ((envie.))'

1. Interactive Element
targets: 'Une'
distractors: 'maison', 'écologique,', 'c'est, ...

2. Interactive Element
targets: 'maison'
distractors: 'Une', 'c'est, 'ce dont', ...

...
```

### puzzlehelper, write

Write and puzzlehelper are interpreted in the same way as each other. It can be composed of both interactive and non interactive elements. It cannot contain distractors.

(Example of puzzlehelper & write)

```
> learnLanguageText: 'der ((*Hibiskus|*sehr leicht))'

1. Element:
'der'

2. Interactive Element:
targets: 'Hibiskus', 'sehr leicht'
```

### choose

The choose interaction contains a number of different interpretations. This may cause confusion in the future.
These can exist in `Item.displayLanguageText` or `Item.learnLanguageText`.

(Example of card, dialog, vocabulary: choose)

```
> ((*Ihr|Wir|Uns)) seid uns wichtig.

1. Interactive Element
targets: 'Ihr'
distractors: 'Wir', 'Uns'

2. Element
'seid uns wichtig.'

...
```

(Example of comprehension: choose)

```
> displayLanguageText: 'Was denkt er über Fernbeziehungen? ((Er hat Angst davor.|*Er hat keine Angst.|Er will unbedingt eine.))'

1. Element
'Was denkt er über Fernbeziehungen?'

2. Interactive Element
targets: 'Er hat keine Angst.'
distractors: 'Er will unbedingt eine.', 'Er hat Angst davor.'
```

(Examples of matching: choose)

If learnLanguageText includes `_` it should be interpreted this way:

> :bulb:	In both of the following cases, distractors are derived from adjacent `Item`s rather than being provided in the scripting directly.

```
> learnLanguageText: 'zwei x zwei =_vier',
> displayLanguageText: '2x2=4',

1. Element
'zwei x zwei ='

2. Interactive Element
targets: 'vier'
distractors: 'drei', 'sieben', ... (derived from other items `Item.learnLanguageText`)
```

Otherwise, this way:

```
> learnLanguageText: 'das Obst'
> displayLanguageText: 'the fruit'

1. Element
'das Obst'

2. Interactive Element
targets: 'the fruit'
distractors: 'the vegetables', 'the cheese', ... (derived from adjacent items `Item.displayLanguageText`)
```

### speak

Speak should not contain markup.
