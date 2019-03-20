import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import API from '../API';

export default class Login extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    loginErrorMessage: '',
    usernameText: '',
    passwordText: ''
  };

  opciones = () => {
    this.props.navigation.navigate('Opciones');
  }

  iniciarSesion = () => {
    const { navigate } = this.props.navigation;
    API.login(this.state.usernameText, this.state.passwordText)
      .then(user => navigate('Home', { user }))
      .catch(loginError => {
        this.setState({
          loginErrorMessage: loginError.message
        })
        setTimeout(() => {
          this.setState({
            loginErrorMessage: ''
          });
        }, 3000);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.nombreContainer}>
            <Text style={styles.nombreText}>Mantenimiento Predictivo</Text>
          </View>

          <KeyboardAvoidingView behavior="padding" style={styles.loginForm}>
            {
              this.state.loginErrorMessage
                ? <Text style={styles.errorDialogue}>
                  {this.state.loginErrorMessage}
                </Text>
                : <Text />
            }
            <TextInput 
              style={styles.inputEmail}
              textContentType='username'
              autoCapitalize='none'
              placeholder='Nombre'
              multiline={true}
              value={this.state.usernameText}
              onChangeText={usernameText => this.setState({ usernameText })}
              />
            <TextInput 
              style={styles.inputPassword}
              textContentType='password'
              autoCapitalize='none'
              placeholder='Contraseña'
              secureTextEntry={true}
              value={this.state.passwordText}
              onChangeText={passwordText => this.setState({ passwordText })}
            />
            <TouchableOpacity
              onPress={this.iniciarSesion}
              style={styles.loginButtonContainer}
            >
              <Text style={styles.loginButton}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
            <Text style={styles.text} onPress={this.opciones}>Opciones</Text>
          </KeyboardAvoidingView>

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  nombreContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginVertical: 50,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          height: -3
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  loginButton: {
    fontSize: 29,
    textAlign: 'center',
  },
  loginButtonContainer: {
    backgroundColor: Colors.noticeBackground,
    borderRadius: 5,
    marginTop: 50,
    width: 300,
  },
  loginForm: {
    marginTop: 100,
    width: '100%',
    height: '40%',
    alignItems: 'center',
  },
  inputEmail: {
    textAlign: 'center',
    height: 50,
    width: '90%',
    fontSize: 20
  },
  inputPassword: {
    textAlign: 'center',
    width: '90%',
    height: 50,
    fontSize: 20
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    margin: 20
  },
  nombreText: {
    fontSize: 17,
    color: Colors.text,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontSize: 40,
      },
      android: {
        fontSize: 20,
      },
    })
  }
});

