import React from 'react';
import {
  Image,
  Platform,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import API from '../API';

export default class Login extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      loginErrorMessage: '',
      usernameText: '',
      passwordText: ''
    };
  }

  iniciarSesion() {
    const { navigate } = this.props.navigation;
    API.login(this.state.usernameText, this.state.passwordText)
      .then(user => navigate('Home'))
      .catch(loginError => {
        this.setState({
          loginErrorMessage:  loginError.message
        })
        setTimeout(() => {
          this.setState({
            loginErrorMessage: ''
          });
        }, 5000);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.nombreContainer}>

            <Text style={styles.nombreText}>Mantenimiento Predictivo</Text>
          </View>

          <View style={styles.loginForm}>
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
              onPress={this.iniciarSesion.bind(this)}
              style={styles.loginButtonContainer}
            >
              <Text style={styles.loginButton}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>

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
  nombreText: {
    fontSize: 17,
    color: Colors.text,
    fontSize: 40,
    textAlign: 'center',
  }
});
