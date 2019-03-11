import React from 'react';
import {
  AsyncStorage,
  View,
  Text
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import Colors from '../../constants/Colors';
import { styles } from './Ficha';
import API from '../API';
import {
  InsumosSeleccionados,
  UnidadesSeleccionadas,
  TecnicosSeleccionados
} from './ItemsSeleccionados'
const TIPOS_DE_FICHA = ['C1', 'C2', 'C3'];


export default class Ficha extends React.Component {
  static navigationOptions = {
    title: 'Review Ficha'
  };

  state = {
    unidadesSeleccionadas: [],
    tecnicosSeleccionados: [],
    insumosSeleccionados: []
  };

  updateIndex = selectedType => {
    this.setState({ selectedType });
  }

  traerDatosFicha = async (ficha, { credentials }) => {
    var insumosSeleccionados, tecnicosSeleccionados, unidadesSeleccionadas;
    try {
      insumosSeleccionados = await API.insumosFicha(ficha, credentials);
      tecnicosSeleccionados = await API.tecnicosFicha(ficha, credentials);
      unidadesSeleccionadas = await API.unidadesFicha(ficha, credentials);
    } catch(e) {
      console.warn(e.request, e)
    }
    console.log(tecnicosSeleccionados, 'tecnicos')
    this.setState({ insumosSeleccionados, tecnicosSeleccionados, unidadesSeleccionadas });
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const ficha = navigation.getParam('ficha');
    const userPlain = await AsyncStorage.getItem('@Store:user');
    const user = JSON.parse(userPlain);
    this._subscribe = this.props.navigation.addListener('didFocus', async () => {
      await this.traerDatosFicha(ficha, user);
    });
  }

  render() {
    const { navigation } = this.props;
    const ficha = navigation.getParam('ficha');
    return <View style={{ backgroundColor: Colors.background }}>
      <KeyboardAwareScrollView
        containerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={80}
      >
        <ButtonGroup
          selectedIndex={TIPOS_DE_FICHA.indexOf(ficha.tipoDeFicha)}
          buttons={TIPOS_DE_FICHA}
          containerStyle={styles.subContainer}
          selectedButtonStyle={styles.selectedButtonStyle}
        />
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Fecha de creacion:
          </Text>
          <DatePicker
            style={styles.date}
            date={ficha.fechaCreacion}
            mode="date"
            format="YYYY-MM-DD"
            showIcon={false}
            disabled={true}
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Fecha a realizar control:
          </Text>
          <DatePicker
            style={styles.date}
            date={ficha.fechaRealizarControl}
            mode="date"
            format="YYYY-MM-DD"
            showIcon={false}
            disabled={true}
          />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Tecnicos:
          </Text>
          <TecnicosSeleccionados tecnicos={this.state.tecnicosSeleccionados} />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Insumos:
          </Text>
          <InsumosSeleccionados insumos={this.state.insumosSeleccionados} />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Unidades de Mantenimiento:
          </Text>
          <UnidadesSeleccionadas unidades={this.state.unidadesSeleccionadas} />
        </View>
        <View style={styles.subContainerPadded}>
          <Text style={styles.title}>
            Observaciones:
          </Text>
          <Text style={styles.textInput}>
            {ficha.observaciones}
          </Text>
        </View>
        <View style={styles.bottomFix} />
      </KeyboardAwareScrollView>
    </View>;
  }
};
