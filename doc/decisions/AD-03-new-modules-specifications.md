# AD-03: New Modules Specifications
- *Creation*: 2018-09-13
- *Deciders*: Alexander Gudulin, Laurens Nienhaus, Alexander Odell, Davide Ramaglietta
- *Last Review*: 2018-09-19
- *Reviewers*: Jana Rekittke, Jayasurian Makkoth
- *Status*: ACCEPTED

## Context

We want to specify technical boundaries for implementing new modules in our source code.

## Decision

New modules should be built keeping in mind possible reusability in other SPAs. 

They should follow the principle of *separation of concerns* (e.g. an extracted view component should not be dependent of service layer).

## Consequences

New modules will be reusable. 
