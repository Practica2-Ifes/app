import React from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Alert,
  Picker,
  StyleSheet
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import Colors from '../../constants/Colors';

const ESTADOS_UNIDAD = ['Encendido', 'Apagado', 'Posible_Falla', 'Reparacion'];

const BUTTONS = ESTADOS_UNIDAD.map(e => {
  return {
    element: () => <Text style={styles.buttonText}>{e}</Text>
  };
});

class UnidadModal extends React.Component {
  
  state = {
    modalVisible: false,
    unidades: [],
    selectedUnidad: {},
    selectedId: '1',
    horas: '0',
    selectedIndex: 0
  };
  
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  
  componentWillReceiveProps(nextProps) {
    const { unidades  } = nextProps;
    const selectedUnidad = unidades.length > 0 ? unidades[0] : {};
    const selectedId = selectedUnidad ? selectedUnidad.$$instanceId : 0;
    this.setState({ unidades, selectedUnidad, selectedId });
  }
  
  onValueChange = selectedId => {
    const selectedUnidad = this.state.unidades.find(i => i.$$instanceId === selectedId) || {};
    this.setState({ selectedId, selectedUnidad });
  }
  
  renderUnidades() {
    const { unidades, selectedId } = this.state;
    return <View>
      <Picker
        selectedValue={selectedId}
        mode="dropdown"
        enabled={true}
        onValueChange={this.onValueChange}
      >
        {unidades.map(
          i => <Picker.Item key={i.$$instanceId} label={i.$$title} value={i.$$instanceId}/>
          )}
      </Picker>
    </View>;
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="none"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View>
            <Text style={styles.title}>Unidad de Mantenimiento:</Text>
            {this.renderUnidades()}
            <Text style={styles.title}>Estado:</Text>
            <ButtonGroup
              onPress={selectedIndex => this.setState({ selectedIndex })}
              selectedIndex={this.state.selectedIndex}
              buttons={BUTTONS}
              containerStyle={styles.subContainer}
              selectedButtonStyle={styles.selectedButton}
            />
            <Text style={styles.title}>Horas:</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.numericInput}
              value={this.state.horas}
              onChangeText={horas => this.setState({ horas })}
            />
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
                this.props.refresh(this.state.selectedUnidad, this.state.horas, ESTADOS_UNIDAD[this.state.selectedIndex])
              }}
              style={styles.buttonStyle}
              disabled={this.state.unidades.length <= 0}
            >
              <Text style={styles.text}>Aceptar</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableHighlight>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.secondaryButtonStyle}
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text style={styles.text}>Agregar Unidades</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    backgroundColor: Colors.secondaryBackground,
    marginTop: 20,
    width: '80%',
    alignSelf: 'center'
  },
  selectedButton: {
    backgroundColor: Colors.noticeBackground
  },
  text: {
    textAlign: 'center',
    fontSize: 15
  },
  title: {
    fontSize: 20,
    marginTop: 40,
    textAlign: 'center'
  },
  numericInput: {
    minWidth: '50%',
    width: 'auto',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    top: 40,
    borderStyle: 'solid',
    borderColor: Colors.text,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5
  },
  buttonText: {
    fontSize: 10
  },
  container: {
    margin: 20,
    alignItems: 'center',
  },
  closetext: {
    fontSize: 10
  },
  buttonStyle: {
    width: '90%',
    margin: 20,
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.noticeBackground,
  },
  secondaryButtonStyle: {
    borderRadius: 5,
    padding: 10,
    marginBottom: -10,
    backgroundColor: Colors.tabIconSelected
  },
  switch: {
    top: -25,
    alignSelf: 'flex-end',
    marginRight: 40
  }
});

export default UnidadModal;
