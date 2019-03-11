import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import API from '../API';
import TecnicoModal from './TecnicoModal';
import InsumoModal from './InsumoModal';
import UnidadModal from './UnidadModal';
import Colors from '../../constants/Colors';
import {
  InsumosSeleccionados,
  UnidadesSeleccionadas,
  TecnicosSeleccionados
} from './ItemsSeleccionados'
const TIPOS_DE_FICHA = ['C1', 'C2', 'C3'];


export default class Ficha extends React.Component {
  static navigationOptions = {
    title: 'Ficha',
  };
  state = {
    user: {},
    tecnicos: [],
    tecnicosSeleccionados: [],
    unidades: [],
    unidadesSeleccionadas: [],
    insumos: [],
    insumosSeleccionados: [],
    selectedType: 0,
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    submitDisabled: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const traerData = async () => {
      await this.traerTecnicos();
      await this.traerInsumos();
      await this.traerUnidades();
    };
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      traerData();
    });
    this.setState({ user }, traerData);
  }

  submitData = () => {
    const {
      fecha,
      user,
      selectedType,
      observaciones
    } = this.state;
    const tipoDeFicha = TIPOS_DE_FICHA[selectedType];
    this.setState({ submitDisabled: true });
    API.guardarFicha(user.credentials, fecha, tipoDeFicha, observaciones)
      .then(ficha => {
        return Promise.all([
          this.guardarTecnicos(ficha),
          this.guardarInsumos(ficha),
          this.guardarUnidades(ficha),
          this.props.navigation.navigate('Home'),
          this.setState({ submitDisabled: false })
        ]);
      });
  }

  guardarTecnicos = ficha => {
    const { user, tecnicosSeleccionados } = this.state;
    if(tecnicosSeleccionados.length > 0) {
      Promise.all(tecnicosSeleccionados.map(t => {
        API.agregarTecnico(user.credentials, ficha.$$instanceId, t.tecnicoSeleccionado, t.horasTrabajo);
      }));
    }
  }

  guardarInsumos = ficha => {
    const { user, insumosSeleccionados } = this.state;
    if(insumosSeleccionados.length > 0) {
      Promise.all(insumosSeleccionados.map(i => {
        API.agregarInsumo(user.credentials, ficha.$$instanceId, i.insumoSeleccionado, i.cantidadUsada);
      }));
    }
  }

  guardarUnidades = ficha => {
    const { user, unidadesSeleccionadas } = this.state;
    if(unidadesSeleccionadas.length > 0) {
      Promise.all(unidadesSeleccionadas.map(i => {
        API.agregarUnidad(user.credentials, ficha.$$instanceId, i.unidadSeleccionada, i.horas, i.estadoUnidad);
      }));
    }
  }
 
  updateIndex = selectedType => {
    this.setState({ selectedType });
  }
  
  traerTecnicos = () => {
    return API.getTecnicos(this.state.user.credentials)
      .then(tecnicos => this.setState({ tecnicos }))
      .catch(console.warn);
  }

  traerInsumos = () => {
    return API.getInsumos(this.state.user.credentials)
      .then(insumos => this.setState({ insumos }))
      .catch(console.warn);
  }

  traerUnidades = () => {
    return API.getUnidades(this.state.user.credentials)
      .then(unidades => this.setState({ unidades }))
      .catch(console.warn);
  }

  refreshTecnicosSeleccionados = (tecnicoSeleccionado, horasTrabajo) => {
    const tecnicosSeleccionados = [
      ...this.state.tecnicosSeleccionados,
      { tecnicoSeleccionado, horasTrabajo }
    ];
    this.setState({ tecnicosSeleccionados });
  }

  refreshInsumosSeleccionados = (insumoSeleccionado, cantidadUsada) => {
    const insumosSeleccionados = [
      ...this.state.insumosSeleccionados,
      { insumoSeleccionado, cantidadUsada }
    ];
    this.setState({ insumosSeleccionados });
  }
  
  refreshUnidadesSeleccionadas = (unidadSeleccionada, horas, estadoUnidad) => {
    const unidadesSeleccionadas = [
      ...this.state.unidadesSeleccionadas,
      { unidadSeleccionada, estadoUnidad, horas }
    ];
    this.setState({ unidadesSeleccionadas });
  }

  render() {
    const {
      tecnicosSeleccionados,
      insumosSeleccionados,
      unidadesSeleccionadas,
      selectedType
    } = this.state;
    return <View style={{ backgroundColor: Colors.background }}>
      <KeyboardAwareScrollView
        containerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={80}
      >
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedType}
          buttons={TIPOS_DE_FICHA}
          containerStyle={styles.subContainer}
          selectedButtonStyle={styles.selectedButtonStyle}
        />
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Fecha:
          </Text>
          <DatePicker
            style={styles.date}
            date={this.state.fecha}
            mode="date"
            placeholder="Seleccionar"
            format="YYYY-MM-DD"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            showIcon={false}
            onDateChange={fecha => this.setState({ fecha })}
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Tecnicos:
          </Text>
          <TecnicosSeleccionados tecnicos={tecnicosSeleccionados} />
          <TecnicoModal
            tecnicos={this.state.tecnicos}
            refresh={this.refreshTecnicosSeleccionados} 
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Insumos:
          </Text>
          <InsumosSeleccionados insumos={insumosSeleccionados} />
          <InsumoModal
            insumos={this.state.insumos}
            refresh={this.refreshInsumosSeleccionados} 
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Unidades de Mantenimiento:
          </Text>
          <UnidadesSeleccionadas unidades={unidadesSeleccionadas} />
          <UnidadModal
            unidades={this.state.unidades}
            refresh={this.refreshUnidadesSeleccionadas} 
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Observaciones:
          </Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            value={this.state.observaciones}
            onChangeText={observaciones => this.setState({ observaciones })}
          />
        </View>
        <View style={styles.bottomFix} />
      </KeyboardAwareScrollView>
      <View style={styles.fixedButton}>
        <TouchableOpacity
          onPress={this.submitData}
          style={styles.buttonStyle}
          disabled={this.state.disabled}
        >
          <Text style={styles.buttonText}>
            Crear
          </Text>
        </TouchableOpacity>
      </View>
    </View>;
  }
};

const subContainer = {
  backgroundColor: Colors.secondaryBackground,
  marginTop: 20,
  width: '80%',
  alignSelf: 'center'
};

export const styles = StyleSheet.create({
  bottomFix: {
    height: 60
  },
  container: {
    flex: 1,
  },
  date: {
    alignSelf: 'center'
  },
  subContainer,
  subContainerPadded: {
    padding: 20,
    ...subContainer
  },
  selectedButtonStyle: {
    backgroundColor: Colors.noticeBackground
  },
  title: {
    fontSize: 15,
    marginBottom: 10,
    alignSelf: 'center',
  },
  text: {
    fontSize: 15,
    textAlign: 'center'
  },
  textInput: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.background
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  },
  buttonStyle: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.noticeBackground,
  },
  fixedButton: {
    position: 'absolute',
    width: '80%',
    alignSelf: 'center',
    bottom: 0,
    padding: 20,
    backgroundColor: 'transparent'
  }
});
