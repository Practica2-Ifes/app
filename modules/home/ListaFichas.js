import React from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';

class ListaFichas extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      fichas: []
    };
    this.renderFichas = this.renderFichas.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ fichas: nextProps.fichas });
  }
  renderFichas() {
    return this.state.fichas.map((item, index) => {
      return <View style={this.props.fichaStyle} key={index}>
        <Text style={this.props.textStyle}>
          {item.$$title}:
        </Text>
      </View>
    });
  }
  
  render() {
    if(this.state.fichas.length <= 0) return null;
    return <ScrollView contentContainerStyle={styles.container} style={this.props.style}>
      {this.renderFichas()}
    </ScrollView>
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '90%',
    margin: 20,
  }
});

export default ListaFichas;
