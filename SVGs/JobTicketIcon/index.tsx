import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Theme } from '../../constant/theme';

const JobTicketIcon = ({color}:any) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M23.52 8.67575V6.51095C23.52 4.41071 21.8115 2.70215 19.7112 2.70215L3.31202 2.70215C1.75058 2.70215 0.480021 3.97151 0.480021 5.53175V8.66135C0.480021 9.05903 0.80234 9.38135 1.20002 9.38135C2.64386 9.38135 3.81842 10.5559 3.81842 11.9997C3.81842 13.4436 2.64386 14.6181 1.20002 14.6181C0.80234 14.6181 0.480021 14.9405 0.480021 15.3381V18.4677C0.480021 20.028 1.75034 21.2973 3.31202 21.2973H19.7112C21.8115 21.2973 23.52 19.5888 23.52 17.4885V15.3549C23.52 14.9573 23.1977 14.6349 22.8 14.6349H22.764C21.3202 14.6349 20.1456 13.4594 20.1456 12.0141C20.1456 10.5689 21.3202 9.39575 22.764 9.39575H22.8C23.1977 9.39575 23.52 9.07343 23.52 8.67575ZM18.7056 12.0141C18.7056 14.0196 20.1675 15.6857 22.08 16.0125V17.4885C22.08 18.7946 21.0173 19.8573 19.7112 19.8573H8.25194L8.25194 16.7229C8.25194 16.3253 7.92962 16.0029 7.53194 16.0029C7.13426 16.0029 6.81194 16.3253 6.81194 16.7229V19.8573H3.31202C2.5445 19.8573 1.92002 19.2341 1.92002 18.4677V15.9905C3.81506 15.6492 5.25842 13.9915 5.25842 11.9997C5.25842 10.008 3.81506 8.35031 1.92002 8.00903V5.53175C1.92002 4.76543 2.5445 4.14215 3.31202 4.14215L6.81194 4.14215V7.27655C6.81194 7.67423 7.13426 7.99655 7.53194 7.99655C7.92962 7.99655 8.25194 7.67423 8.25194 7.27655V4.14215L19.7112 4.14215C21.0173 4.14215 22.08 5.20487 22.08 6.51095V8.01791C20.1675 8.34455 18.7056 10.0099 18.7056 12.0141Z" fill={color? color: Theme.Black}/>
    <Path d="M6.81195 10.0725V13.9269C6.81195 14.3246 7.13427 14.6469 7.53195 14.6469C7.92963 14.6469 8.25195 14.3246 8.25195 13.9269V10.0725C8.25195 9.67486 7.92963 9.35254 7.53195 9.35254C7.13427 9.35254 6.81195 9.67486 6.81195 10.0725Z" fill={color? color: Theme.Black}/>
  </Svg>
);

export default JobTicketIcon;