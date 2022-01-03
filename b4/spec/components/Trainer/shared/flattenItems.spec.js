import flattenItems from '../../../../src/components/Trainer/shared/flattenItems';

describe('#flattenItems', () => {
  describe('when there is more than one item group', () => {
    test('should flatten all items into one list', () => {
      const testItems = {
        itemGroups: [
          {
            title: null,
            image: null,
            items: [
              {
                id: '1',
                type: 'task'
              },
              {
                id: '2',
                type: 'phrase'
              }
            ]
          },
          {
            title: null,
            image: null,
            items: [
              {
                id: '3',
                type: 'phrase'
              },
              {
                id: '4',
                type: 'task'
              }
            ]
          }
        ]
      };
      expect(flattenItems(testItems)).toEqual([
        {
          id: '1',
          type: 'task'
        },
        {
          id: '2',
          type: 'phrase'
        },
        {
          id: '3',
          type: 'phrase'
        },
        {
          id: '4',
          type: 'task'
        }
      ]);
    });
  });

  describe('when there is only one item group', () => {
    test('should flatten all items into one list', () => {
      const testItems = {
        itemGroups: [
          {
            title: null,
            image: null,
            items: [
              {
                id: '1',
                type: 'task'
              },
              {
                id: '2',
                type: 'phrase'
              }
            ]
          }
        ]
      };
      expect(flattenItems(testItems)).toEqual([
        {
          id: '1',
          type: 'task'
        },
        {
          id: '2',
          type: 'phrase'
        }
      ]);
    });
  });
});
