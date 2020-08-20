import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleTheme } from '../redux/actions/index';
import { Switch, StyleSheet } from "react-native";
class ToggleTheme extends Component {

    state = {
        dark: this.props.color.mode === 'Dark' ? true : false
    }
    render() {
        return (
            <Switch
                thumbColor={'white'}
                style={{ marginRight: -10 }}
                ios_backgroundColor={`rgb(${this.props.color.primary})`}
                trackColor={{
                    true: `rgb(${this.props.color.primary})`
                }}
                value={this.state.dark}
                onValueChange={() => {
                    this.props.toggleTheme(this.props.color.mode === 'Dark' ? 'Light' : 'Dark')
                }}
            />
        )
    }
}
const stateToProps = state => ({
    color: state.Theme.theme,
});

const dispatchToProps = dispatch => ({
    toggleTheme: color => dispatch(toggleTheme(color)),
});

export default connect(stateToProps, dispatchToProps)(ToggleTheme);

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }
})