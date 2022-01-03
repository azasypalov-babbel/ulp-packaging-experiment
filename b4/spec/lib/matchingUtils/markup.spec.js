import {
  parseNodesFromMarkup,
  nodeToAttemptString,
  nodeToTargetString,
  filterNodeSelection
} from '../../../src/lib/matchingUtils/markup';

const withFixture = (fixtureInput, cb) => describe(`with "${fixtureInput}"`, function() {
  cb(fixtureInput);
});

describe('markup utils', function() {
  describe('parseNodesFromMarkup', function() {
    withFixture('Hello ((Gap))', (fixture) => {
      const parsed = parseNodesFromMarkup(fixture);
      it('returns 2 items', () => {
        expect(parsed).toHaveLength(2);
      });

      it('first item is a text', () => {
        expect(parsed[0]).toEqual(expect.objectContaining({
          type: 'text'
        }));
      });

      it('second item is a gap', () => {
        expect(parsed[1]).toEqual(expect.objectContaining({
          type: 'gap'
        }));
      });
    });

    withFixture('Hello World!', (fixture) => {
      const parsed = parseNodesFromMarkup(fixture);
      it('returns 1 item', () => {
        expect(parsed).toHaveLength(1);
      });

      it('both items are text', () => {
        expect(parsed).toEqual(expect.arrayContaining([
          expect.objectContaining({
            type: 'text'
          })
        ]));
      });
    });
  });


  describe('nodeToAttemptString', () => {
    describe('for gap node with attempt', () => {
      const FIXTURE = {
        attempt: {
          text: 'Foo'
        }
      };

      it('returns attempt text', () => {
        expect(nodeToAttemptString(FIXTURE)).toEqual(FIXTURE.attempt.text);
      });
    });

    describe('for text node', () => {
      const FIXTURE = {
        text: 'Foo'
      };

      it('returns text', () => {
        expect(nodeToAttemptString(FIXTURE)).toEqual(FIXTURE.text);
      });
    });
  });

  const FIXTURE_CHOICES = ['Foo', 'bar'];

  describe('nodeToTargetString', () => {
    describe('for gap node with target choices', () => {
      const FIXTURE = {
        targetChoices: FIXTURE_CHOICES.map((sentence)=>({ sentence }))
      };

      it('returns joined target choice sentences, separated by space(s)', () => {
        expect(nodeToTargetString(FIXTURE)).toEqual(FIXTURE_CHOICES.join(' '));
      });
    });

    describe('for text node', () => {
      const FIXTURE = {
        text: 'Foo'
      };

      it('returns text', () => {
        expect(nodeToTargetString(FIXTURE)).toEqual(FIXTURE.text);
      });
    });
  });

  describe(`filterNodeSelection`, () => {
    describe(`with nullish node list`, () => {
      it('returns empty list', () => {
        expect(filterNodeSelection()).toEqual(expect.arrayContaining([]));
      });
    });

    describe(`with nodes`, () => {
      describe(`with no attempt taken`, () => {
        const FIXTURE = [{
          type: 'text',
          text: 'Foo'
        }, {
          type: 'gap',
          targetChoices: [{ sentence: 'bar' }]
        }, {
          type: 'text',
          text: ' '
        }, {
          type: 'gap',
          targetChoices: [{ sentence: 'blubb' }]
        }];

        it('returns all nodes up to the first gap', () => {
          expect(filterNodeSelection(FIXTURE)).toEqual(expect.arrayContaining([{
            type: 'text',
            text: 'Foo'
          }]));
        });
      });

      describe(`with attempt on first gap`, () => {
        const FIXTURE = [{
          type: 'text',
          text: 'Foo'
        }, {
          type: 'gap',
          attempt: {
            text: 'bar',
            solved: true
          },
          targetChoices: [{ sentence: 'bar' }]
        }, {
          type: 'text',
          text: ' '
        }, {
          type: 'gap',
          targetChoices: [{ sentence: 'blubb' }]
        }];

        it('returns all nodes up to the second gap', () => {
          expect(filterNodeSelection(FIXTURE)).toEqual(expect.arrayContaining([{
            type: 'text',
            text: 'Foo'
          }, {
            type: 'gap',
            attempt: {
              text: 'bar',
              solved: true
            },
            targetChoices: [{ sentence: 'bar' }]
          }, {
            type: 'text',
            text: ' '
          }]));
        });
      });

      describe(`with attempt on both gaps`, () => {
        const FIXTURE = [{
          type: 'text',
          text: 'Foo'
        }, {
          type: 'gap',
          attempt: {
            text: 'bar',
            solved: true
          },
          targetChoices: [{ sentence: 'bar' }]
        }, {
          type: 'text',
          text: ' '
        }, {
          type: 'gap',
          attempt: {
            text: 'blubb',
            solved: true
          },
          targetChoices: [{ sentence: 'blubb' }]
        }];

        it('returns all nodes', () => {
          expect(filterNodeSelection(FIXTURE)).toEqual(expect.arrayContaining(FIXTURE));
        });
      });
    });
  });
});
