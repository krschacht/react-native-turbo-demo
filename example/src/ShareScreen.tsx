import React, {useRef} from 'react';
import type { SessionMessageCallback } from 'react-native-turbo';
import WebView, { type Props } from './WebView';
import { Share } from 'react-native';
import type {RefObject} from 'packages/turbo/src/VisitableView'

type MessageType = { method: 'share'; shareText: string };

const ShareScreen: React.FC<Props> = (props) => {
  const visitableViewRef = useRef<RefObject>(null);

  const onMessage: SessionMessageCallback = async (message) => {
    const { shareText } = message as MessageType;
    Share.share({
      title: 'Share React Native Web Screen library',
      message: shareText,
    });

    visitableViewRef.current?.injectJavaScript("shared()");
  };
  return <WebView {...props} onMessage={onMessage} ref={visitableViewRef} />;
};

export default ShareScreen;
