import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const InsumosSeleccionados = ({ insumos }) => {
  if (insumos.length <= 0) {
    return <Text style={styles.text}>
      Ningun insumo seleccionado
      </Text>;
  } else {
    return insumos.map((item, index) => {
      return <Text key={index} style={styles.text}>
        {`${item.insumoSeleccionado ? item.insumoSeleccionado.$$title : item.$$title }, x${item.cantidadUsada}`}
      </Text>
    });
  }
}

export const TecnicosSeleccionados = ({ tecnicos }) => {
  if (tecnicos.length <= 0) {
    return <Text style={styles.text}>
      Ningun tecnico seleccionado
      </Text>;
  } else {
    return tecnicos.map((item, index) => {
      return <Text key={index} style={styles.text}>
        {`${item.tecnicoSeleccionado ? item.tecnicoSeleccionado.$$title : item.$$title}, ${item.horasTrabajo} horas`}
      </Text>
    });
  }
}

export const UnidadesSeleccionadas = ({ unidades }) => {
  if (unidades.length <= 0) {
    return <Text style={styles.text}>
      Ninguna Unidad de Mantenimiento seleccionada
      </Text>;
  } else {
    return unidades.map((item, index) => {
      return <Text key={index} style={styles.text}>
        {item.unidadSeleccionada ? item.unidadSeleccionada.$$title : item.$$title}
      </Text>
    });
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    textAlign: 'center'
  }
});
