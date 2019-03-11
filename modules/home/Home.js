import React from 'react';
import { Button, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
import Colors from '../../constants/Colors';
import API from '../API';
import ListaFichas from './ListaFichas';

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: null,
    headerRight: (
      <Button
        onPress={() => navigation.navigate('Opciones')}
        title="Opciones"
        color={Colors.text}
      />
    )
  });

  state = {
    fichas: [],
    user: {
      nombre: '',
      apellido: '',
      tipoTecnico: '',
      credentials: ''
    }
  };

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.validarUsuario().then(this.traerFichas);
    });
  }

  nuevaFicha = () => {
    this.props.navigation.navigate('Ficha', { user: this.state.user });
  }

  traerFichas = () => {
    return API.getFichas(this.state.user.credentials)
      .then(fichas => {
        this.setState({ fichas });
      })
      .catch(e => console.log(e.request));
  }

  validarUsuario = () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user', null);
    if(!user) {
      return API.getUser()
        .then(user => {
          if(user) {
            this.setState({ user });
          } else {
            navigation.navigate('Login');
          }
        })
        .catch(e => {
          console.warn(e);
          navigation.navigate('Login');
        });
    } else {
      return new Promise((resolve, reject) => {
        return this.setState({ user }, resolve);
      });
    }
  }

  render() {
    return (
      <ScrollView style={styles.scrollStyle} contentContainerStyle={styles.mainContainer}>
        <Text style={styles.textStyle}>
          Bienvenido, {this.state.user.nombre} {this.state.user.apellido}
        </Text>
        <TouchableOpacity style={styles.buttonStyle} onPress={this.nuevaFicha}>
          <Text style={styles.buttonText}>
            Nueva Ficha
          </Text>
        </TouchableOpacity>
        <ListaFichas
          fichas={this.state.fichas}
          style={styles.listaFichas}
          secondaryTextStyle={styles.fichaSecondaryText}
          navigation={this.props.navigation}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  fichaSecondaryText: {
    fontSize: 15,
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollStyle: {
    display: 'flex',
    backgroundColor: Colors.background,
    height: '100%',
    width: '100%'
  },
  textStyle: {
    margin: 20,
    textAlign: 'center',
    fontSize: 25
  },
  buttonText: {
    fontSize: 30,
    textAlign: 'center'
  },
  listaFichas: {
    backgroundColor: Colors.secondaryBackground
  },
  buttonStyle: {
    margin: 20,
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.noticeBackground,
  }
});
