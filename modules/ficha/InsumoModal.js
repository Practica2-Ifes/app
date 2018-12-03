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
import Colors from '../../constants/Colors';

class InsumoModal extends React.Component {

  state = {
    modalVisible: false,
    insumos: [],
    selectedInsumo: {},
    selectedId: '1',
    cantidadUsada: '1'
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentWillReceiveProps(nextProps) {
    const { insumos  } = nextProps;
    const selectedInsumo = insumos.length > 0 ? insumos[0] : {};
    const selectedId = selectedInsumo ? selectedInsumo.$$instanceId : 0;
    this.setState({ insumos, selectedInsumo, selectedId });
  }

  onValueChange = selectedId => {
    const selectedInsumo = this.state.insumos.find(i => i.$$instanceId === selectedId) || {};
    this.setState({ selectedId, selectedInsumo });
  }

  renderInsumos() {
    const { insumos, selectedId } = this.state;
    return <View>
      <Picker
        selectedValue={selectedId}
        mode="dropdown"
        enabled={true}
        onValueChange={this.onValueChange}
      >
        {insumos.map(
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
            <Text style={styles.title}>Insumos:</Text>
            {this.renderInsumos()}
            <Text style={styles.title}>Cantidad Usada:</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.numericInput}
              value={this.state.cantidadUsada}
              onChangeText={cantidadUsada => this.setState({ cantidadUsada })}
            />
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
                this.props.refresh(this.state.selectedInsumo, this.state.cantidadUsada)
              }}
              style={styles.buttonStyle}
            >
              <Text style={styles.text}>Aceptar</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.setModalVisible(false)}
              style={styles.closeButton}
              disabled={this.state.insumos.length <= 0}
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
          <Text style={styles.text}>Agregar Insumos</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});

export default InsumoModal;
