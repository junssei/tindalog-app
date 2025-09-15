import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';

import StackNavigation from './src/navigation';

function App() {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}

export default App;
