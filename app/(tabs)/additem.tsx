import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const FavoritesScreen = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>Cart Screen</Text>
    </View>
  )
}

export default FavoritesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})