import _ from 'lodash';
import store from '../redux/store';
import React, { PureComponent } from "react";
import {
    StyleSheet,
} from "react-native";
import {
    View,
    Text,
    AnimatableManager,
    ListItem,
} from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
import TouchableScale from 'react-native-touchable-scale';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

class OrderList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ThemeColor: store.getState().Theme.theme,
            showCustomIcons: false

        };
        store.subscribe(() => {
            var color = store.getState().Theme.theme;
            this.setState({ ThemeColor: color })
        });
    }

    render() {
        const { ThemeColor } = this.state;
        const { order, index, navigation, onPress } = this.props
        const animationProps = AnimatableManager.presets.fadeInRight;
        const imageAnimationProps = AnimatableManager.getRandomDelay();
        return (
            <Animatable.View {...animationProps} key={`${order.order_id}-${index}`}>
                <ListItem
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={() => navigation.navigate("OrderDetail", { order })}
                    containerStyle={{ ...styles.Lists, backgroundColor: ThemeColor.Bg2 }}
                >
                    <ListItem.Part left>
                        <TouchableScale activeScale={0.95}>
                            {order.status === 'Pending' &&
                                <Feather name={'clock'} size={22} style={{ ...styles.image, backgroundColor: `rgba(${ThemeColor.warning},0.2)` }} color={`rgb(${ThemeColor.warning})`} />}
                            {order.status === 'Cancelled' &&
                                <Feather name={'x-circle'} size={22} style={{ ...styles.image, backgroundColor: `rgba(${ThemeColor.danger},0.2)` }} color={`rgb(${ThemeColor.danger})`} />}
                            {order.status === 'Confirmed' &&
                                <Feather name={'check'} size={22} style={{ ...styles.image, backgroundColor: `rgba(${ThemeColor.primary},0.2)` }} color={`rgb(${ThemeColor.primary})`} />}
                            {order.status === 'Delivering' &&
                                <Feather name={'truck'} size={22} style={{ ...styles.image, backgroundColor: `rgba(${ThemeColor.secondary},0.2)` }} color={`rgb(${ThemeColor.secondary})`} />}
                            {order.status === 'Completed' &&
                                <Feather name={'check-circle'} size={22} style={{ ...styles.image, backgroundColor: `rgba(${ThemeColor.success},0.2)` }} color={`rgb(${ThemeColor.success})`} />}
                        </TouchableScale>
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                            <TouchableScale activeScale={0.95}
                                onPress={() => navigation.navigate("OrderDetail", { order })}>
                                <Text dark10 text70 style={{ flex: 1, marginRight: 10, color: ThemeColor.header }} numberOfLines={1}>{order.order_id}</Text>
                            </TouchableScale>
                            <Text style={{ color: `rgb(${ThemeColor.primary})` }}>
                                {moment(order.created_at).format('DD/MM/YYYY')}
                            </Text>
                        </ListItem.Part>
                        <ListItem.Part>
                            {order.status === 'Pending' &&
                                <Text style={{ flex: 1, marginRight: 10, color: `rgb(${ThemeColor.warning})` }} text90 numberOfLines={1}>{order.status}</Text>}
                            {order.status === 'Cancelled' &&
                                <Text style={{ flex: 1, marginRight: 10, color: `rgb(${ThemeColor.danger})` }} text90 numberOfLines={1}>{order.status}</Text>}
                            {order.status === 'Confirmed' &&
                                <Text style={{ flex: 1, marginRight: 10, color: `rgb(${ThemeColor.primary})` }} text90 numberOfLines={1}>{order.status}</Text>}
                            {order.status === 'Delivering' &&
                                <Text style={{ flex: 1, marginRight: 10, color: `rgb(${ThemeColor.secondary})` }} text90 numberOfLines={1}>{order.status}</Text>}
                            {order.status === 'Completed' &&
                                <Text style={{ flex: 1, marginRight: 10, color: `rgb(${ThemeColor.success})` }} text90 numberOfLines={1}>{order.status}</Text>}
                            <TouchableScale activeScale={0.85}
                                style={{
                                    backgroundColor: `rgba(${ThemeColor.danger},0.2)`,
                                    padding: 5,
                                    borderRadius: 10,
                                    marginLeft: 10
                                }}
                                onPress={() => onPress(index, 'order')}>
                                <Feather name={'trash'} size={18} color={`rgb(${ThemeColor.danger})`} />
                            </TouchableScale>
                        </ListItem.Part>
                    </ListItem.Part>
                </ListItem>
            </Animatable.View>
        );
    }
}
export default OrderList;
const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 14,
    },
    Lists: {
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 10,
        marginBottom: 10
    }
});
