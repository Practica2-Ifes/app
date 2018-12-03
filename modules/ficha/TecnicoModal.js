import React from 'react';
import {
  Picker,
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  TextInput
} from 'react-native';
import Colors from '../../constants/Colors';

class TecnicoModal extends React.Component {

  state = {
    modalVisible: false,
    tecnicos: [],
    selectedTecnico: {},
    selectedId: 1,
    horasTrabajo: '0'
  };

  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentWillReceiveProps(nextProps) {
    const { tecnicos  } = nextProps;
    const selectedTecnico = tecnicos.length > 0 ? tecnicos[0] : {};
    const selectedId = selectedTecnico ? selectedTecnico.$$instanceId : 0;
    this.setState({ tecnicos, selectedTecnico, selectedId });
  }

  onValueChange(selectedId) {
    const selectedTecnico = this.state.tecnicos.find(i => i.$$instanceId === selectedId) || {};
    this.setState({ selectedTecnico, selectedId });
  }

  renderTecnico() {
    const { tecnicos, selectedId } = this.state;
    return <View style={styles.picker}>
      <Picker
        selectedValue={selectedId}
        mode="dropdown"
        enabled={true}
        onValueChange={this.onValueChange}
      >
        {tecnicos && tecnicos.map ? tecnicos.map(i => <Picker.Item key={i.$$title} label={i.$$title} value={i.$$instanceId}/>): null}
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
          }}
        >
          <View>
            <Text style={styles.title}>Tecnico:</Text>
            {this.renderTecnico()}
            <Text style={styles.title}>Horas de trabajo:</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.numericInput}
              value={this.state.horasTrabajo}
              onChangeText={horasTrabajo => this.setState({ horasTrabajo })}
            />
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
                this.props.refresh(this.state.selectedTecnico, this.state.horasTrabajo)
              }}
              style={styles.buttonStyle}
              disabled={this.state.tecnicos.length <= 0}
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
          }}
        >
          <Text style={styles.text}>Agregar Tecnico</Text>
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
    left: 10,
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

export default TecnicoModal;
