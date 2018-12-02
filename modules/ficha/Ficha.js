import React from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import API from '../API';
import TecnicoModal from './TecnicoModal';
import InsumoModal from './InsumoModal';
import UnidadModal from './UnidadModal';
import Colors from '../../constants/Colors';

export default class Ficha extends React.Component {
  static navigationOptions = {
    title: 'Nueva Ficha',
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      tecnicos: [],
      tecnicosSeleccionados: [],
      unidades: [],
      unidadesSeleccionadas: [],
      insumos: [],
      insumosSeleccionados: [],
      selectedType: 0,
      fecha: new Date().toISOString(),
      fechaControl: new Date().toISOString(),
      anotaciones: ''
    };
    this.traerTecnicos = this.traerTecnicos.bind(this);
    this.renderTecnicosSeleccionados = this.renderTecnicosSeleccionados.bind(this);
    this.refreshTecnicosSeleccionados = this.refreshTecnicosSeleccionados.bind(this);
    this.renderInsumosSeleccionados = this.renderInsumosSeleccionados.bind(this);
    this.refreshInsumosSeleccionados = this.refreshInsumosSeleccionados.bind(this);
    this.renderUnidadesSeleccionadas = this.renderUnidadesSeleccionadas.bind(this);
    this.refreshUnidadesSeleccionadas = this.refreshUnidadesSeleccionadas.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ user }, async () => {
      await this.traerTecnicos();
      await this.traerInsumos();
      await this.traerUnidades();
    });
  }
 
  updateIndex (selectedType) {
    this.setState({ selectedType });
  }
  
  traerTecnicos() {
    return API.getTecnicos(this.state.user.credentials)
      .then(tecnicos => this.setState({ tecnicos }))
      .catch(console.warn);
  }

  traerInsumos() {
    return API.getInsumos(this.state.user.credentials)
      .then(insumos => this.setState({ insumos }))
      .catch(console.warn);
  }

  traerUnidades() {
    return API.getUnidades(this.state.user.credentials)
      .then(unidades => this.setState({ unidades }))
      .catch(console.warn);
  }

  refreshTecnicosSeleccionados(tecnicosSeleccionados) {
    this.setState({ tecnicosSeleccionados });
  }

  refreshInsumosSeleccionados(insumosSeleccionados) {
    this.setState({ insumosSeleccionados });
  }

  refreshUnidadesSeleccionadas(unidadesSeleccionadas) {
    this.setState({ unidadesSeleccionadas });
  }

  renderTecnicosSeleccionados(tecnicos) {
    if(tecnicos.length <= 0) {
      return <Text style={styles.text}>
        Ningun tecnico seleccionado
      </Text>;
    } else {
      return tecnicos.map((item, index) => {
        return <Text key={index} style={styles.text}>
          {item.label}
        </Text>
      });
    }
  }

  renderInsumosSeleccionados(insumos) {
    if(insumos.length <= 0) {
      return <Text style={styles.text}>
        Ningun insumo seleccionado
      </Text>;
    } else {
      return insumos.map((item, index) => {
        return <Text key={index} style={styles.text}>
          {item.label}
        </Text>
      });
    }
  }

  renderUnidadesSeleccionadas(insumos) {
    if(insumos.length <= 0) {
      return <Text style={styles.text}>
        Ninguna Unidad de Mantenimiento seleccionada
      </Text>;
    } else {
      return insumos.map((item, index) => {
        return <Text key={index} style={styles.text}>
          {item.label}
        </Text>
      });
    }
  }

  render() {
    const {
      tecnicosSeleccionados,
      insumosSeleccionados,
      unidadesSeleccionadas,
      selectedType
    } = this.state;
    const tiposDeFicha = ['C1', 'C2', 'C3'];
    return <View style={{ backgroundColor: Colors.background }}>
      <ScrollView containerStyle={styles.container}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedType}
          buttons={tiposDeFicha}
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
            Fecha a realizar control:
          </Text>
          <DatePicker
            style={styles.date}
            date={this.state.fechaControl}
            mode="date"
            placeholder="Seleccionar"
            format="YYYY-MM-DD"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            showIcon={false}
            onDateChange={fechaControl => this.setState({ fechaControl })}
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Tecnicos:
          </Text>
          { this.renderTecnicosSeleccionados(tecnicosSeleccionados) }
          <TecnicoModal
            tecnicos={this.state.tecnicos}
            refresh={this.refreshTecnicosSeleccionados} 
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Insumos:
          </Text>
          { this.renderInsumosSeleccionados(insumosSeleccionados) }
          <InsumoModal
            insumos={this.state.insumos}
            refresh={this.refreshInsumosSeleccionados} 
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Unidades de Mantenimiento:
          </Text>
          { this.renderUnidadesSeleccionadas(unidadesSeleccionadas) }
          <UnidadModal
            unidades={this.state.unidades}
            refresh={this.refreshUnidadesSeleccionadas} 
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Anotaciones:
          </Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            value={this.state.anotaciones}
            onChangeText={anotaciones => this.setState({ anotaciones })}
          />
        </View>
        <View style={styles.bottomFix} />
      </ScrollView>
      <View style={styles.fixedButton}>
        <TouchableOpacity
          onPress={this.submitData}
          style={styles.buttonStyle}
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

const styles = StyleSheet.create({
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
