import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
import Colors from '../../constants/Colors';
import API from '../API';
import ListaFichas from './ListaFichas';

export default class Home extends React.Component {
  static navigationOptions = {
    headerLeft: null
  };

  constructor(props) {
    super(props);
    this.state = {
      fichas: [],
      user: {
        nombre: '',
        apellido: '',
        tipoTecnico: '',
        credentials: ''
      }
    };
    this.nuevaFicha = this.nuevaFicha.bind(this);
    this.validarUsuario = this.validarUsuario.bind(this);
    this.traerFichas = this.traerFichas.bind(this);
  }
  componentDidMount() {
    this.validarUsuario().then(this.traerFichas);
  }

  nuevaFicha() {
    this.props.navigation.navigate('Ficha', { user: this.state.user });
  }

  traerFichas() {
    API.getFichas(this.state.user.credentials)
      .then(fichas => {
        this.setState({ fichas });
      })
      .catch(console.warn);
  }

  validarUsuario() {
    const { navigation } = this.props;
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
          textStyle={styles.fichaText}
          secondaryTextStyle={styles.fichaSecondaryText}
          fichaStyle={styles.ficha}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  fichaText: {
    fontSize: 20,
  },
  fichaSecondaryText: {
    fontSize: 15,
  },
  ficha: {
    margin: 10
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
