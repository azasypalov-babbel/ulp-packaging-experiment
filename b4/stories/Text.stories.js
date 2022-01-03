import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import Text from '../src/components/shared/Text';

const stories = storiesOf('Text', module);
stories.addDecorator(withKnobs);

const getProps = () => ({
  children: text('text', 'All their equipment and instruments are alive.'),
  fontSize: select(
    'fontSize',
    ['xsmall', 'small', 'medium', 'big', 'large', 'xlarge', 'grand'],
    'medium'
  ),
  fontFamily: select(
    'fontFamily',
    [
      'fontMilliardSemi',
      'fontMilliardBook',
      'fontMilliardMedium',
      'fontLeituraBold'
    ],
    'fontMilliardBook'
  ),
  textAlign: select('textAlign', ['left', 'center', 'right'], 'left'),
  color: text('color', 'spaceGrayW15')
});

stories.add('Customizable Text', () => <Text {...getProps()} />);

stories.add('Headings', () => {
  return (
    <React.Fragment>
      <Text
        as="h1"
        fontSize={'large'}
        color={'spaceGrayW15'}
        fontFamily={'fontMilliardMedium'}
      >
        Default headline
      </Text>
      <Text
        as="h1"
        fontSize={'large'}
        color={'spaceGrayW15'}
        fontFamily={'fontLeituraBold'}
      >
        Default headline with Leitura
      </Text>
      <Text
        as="h1"
        fontSize={'xlarge'}
        color={'spaceGrayW15'}
        fontFamily={'fontLeituraBold'}
      >
        XLarge headline with Leitura
      </Text>
      <Text
        as="h1"
        fontSize={'grand'}
        color={'spaceGrayW15'}
        fontFamily={'fontLeituraBold'}
      >
        Grand Headline with Leitura
      </Text>
      <Text
        as="h2"
        fontSize={'big'}
        color={'spaceGrayW15'}
        fontFamily={'fontMilliardMedium'}
      >
        Text default subtitle
      </Text>
      <Text
        as="h3"
        fontSize={'medium'}
        color={'spaceGrayW15'}
        fontFamily={'fontMilliardMedium'}
      >
        H3 default
      </Text>
    </React.Fragment>
  );
});

stories.add('Paragraph', () => {
  return (
    <Text
      as="p"
      fontSize={'small'}
      color={'spaceGrayW15'}
      fontFamily={'fontMilliardBook'}
    >
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet.
    </Text>
  );
});
