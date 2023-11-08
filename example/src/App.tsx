import React, { useCallback } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { default as NativeScreen } from './NumbersScreen';
import ErrorScreen from './ErrorScreen';
import {
  SessionMessageCallback,
  OnErrorCallback,
  Session,
  withSession,
} from 'react-native-turbo';
import { Routes, webScreens } from 'example/src/webScreen';
import NestedTab from 'example/src/NestedTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: '#00094a',
        tabBarActiveTintColor: '#00094a',
      }}
    >
      <Tab.Screen {...webScreens.screens.WebviewInitial} />
      <Tab.Screen
        name={Routes.NestedTabNative}
        component={NativeScreen}
        options={{ title: 'Native Tab' }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const navigation = useNavigationContainerRef<any>();

  const handleVisitError = useCallback<OnErrorCallback>(
    (error) => {
      const notLoggedIn = error.statusCode === 401;
      if (notLoggedIn) {
        navigation.navigate(Routes.SignIn, { path: 'signin' });
      }
    },
    [navigation]
  );

  const onMessageHandler = useCallback<SessionMessageCallback>(
    (message) => console.log(message),
    []
  );

  return (
    <Session onMessage={onMessageHandler} onVisitError={handleVisitError}>
      <NavigationContainer linking={webScreens.linking} ref={navigation}>
        <Stack.Navigator
          screenOptions={{
            headerBackTitle: 'Back',
            headerTintColor: '#00094a',
          }}
        >
          <Stack.Screen
            options={{ headerShown: false }}
            name={Routes.BottomTabs}
            component={BottomTabs}
          />
          <Stack.Screen
            name={Routes.NumbersScreen}
            component={NativeScreen}
            options={{ title: 'A List of Numbers' }}
          />
          <Stack.Screen {...webScreens.screens.New} />
          <Stack.Screen {...webScreens.screens.SuccessScreen} />
          <Stack.Screen {...webScreens.screens.One} />
          <Stack.Screen {...webScreens.screens.Fallback} />
          <Stack.Screen
            {...webScreens.screens.SignIn}
            options={{
              presentation: 'formSheet',
              gestureEnabled: 'false',
            }}
          />
          <Stack.Screen
            name={Routes.NotFound}
            component={ErrorScreen}
            options={{ title: 'Not Found' }}
          />
          <Stack.Screen
            name={Routes.NestedTab}
            component={withSession(NestedTab)}
            options={{ title: 'Nested Top Tab' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Session>
  );
};

export default App;
