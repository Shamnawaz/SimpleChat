import { View, Text, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';

const ProfileTab = () => {
  
  const { signOut } = useAuth();

  return (
    <SafeAreaView className='bg-surface flex-1'>
      <ScrollView>
        <Text className='text-white'>Profile Tab</Text>
        <Pressable className='mt-4 bg-red-500 px-4 py-2 rounded-lg' onPress={() => signOut()}>
          <Text>se déconnecter</Text> 
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
};

export default ProfileTab;