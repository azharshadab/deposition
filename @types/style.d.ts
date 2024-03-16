import 'styled-components';
import { colors } from '../styles/colors';

type CustomTheme = typeof colors;

declare module 'styled-components' {
  export interface DefaultTheme extends CustomTheme {}
}
