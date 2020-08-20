import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import store from '../redux/store';

export default class Divider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ThemeColor: store.getState().Theme.theme
    };
    store.subscribe(() => {
      var color = store.getState().Theme.theme;
      this.setState({ ThemeColor: color })
    });
  }

  render() {
    const { color, style, ...props } = this.props;
    const { ThemeColor } = this.state;
    return (
      <View
        style={{ ...styles.divider, borderBottomColor: ThemeColor.divider }}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    height: 0,
    marginVertical: 10,
    borderBottomWidth: 1
  }
});
