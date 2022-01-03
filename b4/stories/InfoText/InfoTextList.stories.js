import React from 'react';
import { storiesOf } from '@storybook/react';
import { InfoTextList } from '../../src/components/shared/InfoText/InfoTextList';

const stories = storiesOf('InfoText', module);

const props = {
  infoTexts: [
    'Pinnace holystone mizzenmast quarter crows nest nipperkin grog yardarm hempen halter furl.',
    'Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm',
    'Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway.',
    'Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crows nest rutters.',
    'Fluke jib scourge of the seven seas Jack Tar transom spirits.Fluke the seven seas boatswain schooner'
  ],
  hide: () => {}
};

stories.add('InfoText List', () => {
  return <InfoTextList {...props} />;
});
