import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: 'Homexx',
        headerStyle: {
          backgroundColor: '#0C4986',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShown: false
      }}/>

    </Stack>
  );
}
