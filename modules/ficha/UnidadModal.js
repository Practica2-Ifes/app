import React from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, ScrollView, StyleSheet } from 'react-native';
import SelectMultiple from 'react-native-select-multiple';
import Colors from '../../constants/Colors';

class UnidadModal extends React.Component {

  state = {
    modalVisible: false,
    unidades: [],
    selectedItems: []
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ unidades: nextProps.unidades });
  }

  onSelectionsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }

  formatUnidades(unidades) {
    return unidades.map(i => {
      return { label: i.$$title, value: i };
    });
  }

  renderUnidades() {
    const { unidades } = this.state;
    const formattedUnidades = this.formatUnidades(unidades);
    return <View>
      <SelectMultiple
        items={formattedUnidades}
        selectedItems={this.state.selectedItems}
        onSelectionsChange={this.onSelectionsChange} />
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
          <View style={styles.container}>
            <View>
              <Text style={styles.text}>Unidades de Mantenimiento</Text>
              <ScrollView contentContainerStyle={styles.container} style={this.props.style}>
                {this.renderUnidades()}
              </ScrollView>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
                  this.props.refresh(this.state.selectedItems)
                }}
                style={styles.buttonStyle}
              >
                <Text style={styles.text}>Aceptar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.secondaryButtonStyle}
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text style={styles.text}>Agregar Unidades de Mantenimiento</Text>
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
  container: {
    margin: 20,
    alignItems: 'center',
  },
  buttonStyle: {
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

export default UnidadModal;
