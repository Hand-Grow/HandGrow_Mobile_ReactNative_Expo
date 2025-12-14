// src/components/Container.tsx
import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

interface ContainerProps extends SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  style, 
  backgroundColor = '#fff',
  ...props 
}) => {
  return (
    <SafeAreaView 
      style={[{ flex: 1, backgroundColor }, style]} 
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};
