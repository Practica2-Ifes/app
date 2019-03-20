import React, { Component } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import API from '../API';
import Colors from '../../constants/Colors';

export default class Opciones extends Component {
  state = {
    text: API.apiUrl
  }

  guardar = () => {
    API.apiUrl = this.state.text;
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          API URL:
        </Text>
        <TextInput
          style={styles.textInput}
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
          multiline={true}
        />
        <TouchableOpacity style={styles.button} onPress={this.guardar}>
          <Text style={styles.text}>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  textInput: {
    fontSize: 20,
    marginVertical: 10,
    width: '100%',
    padding: 10,
    backgroundColor: Colors.secondaryBackground
  },
  button: {
    backgroundColor: Colors.noticeBackground,
    padding: 15,
    borderRadius: 5
  },
  container: {
    margin: 10,
    flex: 1,
    alignItems: 'center'
  }
});
