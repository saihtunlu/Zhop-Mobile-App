import React from 'react'
import {
    Text,
    TextInput,
    View,
    StyleSheet
} from 'react-native'
import TouchableScale from 'react-native-touchable-scale';
import store from '../redux/store';


export default class NumberStepper extends React.Component {

    _effectiveInitialValue = () => {
        var { initialValue, minValue, maxValue } = this.props
        return Math.min(Math.max(initialValue, minValue), maxValue)
    }
    state = {
        value: this._effectiveInitialValue(),
        ThemeColor: store.getState().Theme.theme
    }
    _decrementValue = () => {
        var { autoRepeat, maxValue, minValue, stepValue } = this.props
        var newValue = this.state.value - stepValue
        if (newValue < minValue) {
            return false;
        }
        !(newValue < minValue) ? this._updateValue(newValue) : autoRepeat ? this._updateValue(maxValue) : null
    }
    _incrementValue = () => {
        var { autoRepeat, maxValue, minValue, stepValue } = this.props
        var newValue = this.state.value + stepValue
        !(newValue > maxValue) ? this._updateValue(newValue) : autoRepeat ? this._updateValue(minValue) : null
    }
    _updateValue = (value) => {
        this.setState({ value })
        this.props.onValueChange(value)
    }
    _renderButton = (char, onPress) => {
        var props = this.props, { buttonsUnderlayColor } = props
        const { ThemeColor } = this.state;
        return (
            <TouchableScale
                onPress={onPress}
                style={{ ...styles(props).buttonContainer, backgroundColor: ThemeColor.Bg3 }}
                backgroundColor={ThemeColor.Bg3}
                activeScale={0.85}
                underlayColor={buttonsUnderlayColor}>
                <Text
                    style={{ ...styles(props).buttonText, color: ThemeColor.text1 }}
                    color={ThemeColor.text1}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {char}
                </Text>
            </TouchableScale>
        )
    }
    render() {
        var props = this.props, { decrementButtonText, maxValue, minValue, } = props
        const { ThemeColor } = this.state;
        return (
            <View style={styles(props).outerContainer}>
                {this._renderButton(decrementButtonText, this._decrementValue)}
                <View style={styles(props).innerContainer}>
                    <TextInput
                        keyboardType={'numeric'}
                        maxValue={maxValue}
                        numeric value
                        textAlign={'center'}
                        minValue={minValue}
                        style={{ ...styles(props).label, color: ThemeColor.text1 }}
                        onChangeText={text => this._updateValue(text)}
                        value={this.state.value.toString()}
                    />
                </View>
                {this._renderButton(props.incrementButtonText, this._incrementValue)}
            </View>
        )
    }

}
const styles = () => StyleSheet.create({
    buttonContainer: {
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 20,
        textAlign: "center",
    },
    innerContainer: {
        alignItems: "center",
        marginHorizontal: 5,
        justifyContent: "center",
    },
    label: {
        fontWeight: "600",
    },
    outerContainer: {
        alignItems: "stretch",
        flexDirection: "row",
    },
})
NumberStepper.defaultProps = {
    autoRepeat: true,
    decrementButtonText: "-",
    incrementButtonText: "+",
    initialValue: 0,
    minValue: 0,
    maxValue: 5,
    stepValue: 1,
    onValueChange: () => { },
}