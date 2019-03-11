import React from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';

class ListaFichas extends React.Component {
  state = {
    fichas: []
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ fichas: nextProps.fichas });
  }

  redirect = ficha => {
    this.props.navigation.navigate('FichaReview', { ficha });
  }

  renderFichas = () => {
    const sortedFichas = this.state.fichas.sort((a, b) => a.$$title - b.$$title);
    return this.state.fichas.reverse().map((item, index) => {
      return <TouchableOpacity style={styles.ficha} key={index} onPress={() => this.redirect(item)}>
        <Text style={styles.text}>
          {item.$$title}
        </Text>
      </TouchableOpacity>
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
    margin: 20,
  },
  text: {
    fontSize: 25,
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 10
  },
  ficha: {
  }
});

export default ListaFichas;
