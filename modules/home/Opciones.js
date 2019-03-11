import React, { Component } from 'react';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';
import API from '../API';

export default class Opciones extends Component {
  state = {
    text: API.apiUrl
  }

  render() {
    return (
      <View>
        <TextInput
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
        />
        <TouchableOpacity>
          <Text>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
