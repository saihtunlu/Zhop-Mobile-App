import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
class ScrollableTabBar extends React.PureComponent {

    render() {
        const { tabs, ThemeColor } = this.props;
        return (
            <FlatList
                data={tabs}
                style={{
                    marginHorizontal: 10,
                    maxHeight: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: ThemeColor.divider
                }}
                horizontal={true}
                renderItem={({ item, index }) =>
                    <TouchableScale
                        key={item}
                        activeScale={0.985}
                        onPress={() => this.props.goToPage(index)}
                        style={{ ...styles.tab, flexDirection: 'row', alignItems: 'center', }}>
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 10,
                                marginRight: 5,
                                backgroundColor: this.props.activeTab === index ? `rgb(${ThemeColor.primary})` : ThemeColor.Bg2
                            }}
                        >
                        </View>
                        <Text style={{
                            color: this.props.activeTab === index ? `rgb(${ThemeColor.primary})` : ThemeColor.header,
                            fontWeight: 'bold'
                        }}>{item.toUpperCase()}</Text>
                    </TouchableScale>}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `#tabBar-${index}`}
            />
        )
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginRight: 5
    },
});

export default ScrollableTabBar;