# AD-01: `b3` Source Code Maintenance
- *Creation*: 2018-09-13
- *Deciders*: Alexander Gudulin, Laurens Nienhaus, Alexander Odell, Davide Ramaglietta
- *Last Review*: 2018-09-19
- *Reviewers*: Jana Rekittke, Jayasurian Makkoth
- *Status*: ACCEPTED

## Context

`b3` source code (previously known as `learning.gem`) is legacy which has to be maintained.

The goal is to reduce old source code to contain only legacy trainers UI.

## Decision

`b3` modules cannot be exported for usage in `b4`.

If `b4` depends on functionality from b3 it should be extracted and isolated, since chances are that it is reusable (e.g. `babbelMarkupHelper`).

## Consequences

`b3` source code complexity will not be increased.
