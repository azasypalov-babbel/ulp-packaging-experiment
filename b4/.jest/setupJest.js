import 'raf/polyfill';
import 'jest-styled-components';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import enableHooks from 'jest-react-hooks-shallow';


import registerRequireContextHook from '@storybook/babel-plugin-require-context-hook/register';
registerRequireContextHook();
enableHooks(jest);

Enzyme.configure({ adapter: new Adapter() });
