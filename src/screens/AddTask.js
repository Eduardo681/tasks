import React, { Component } from 'react';
import {
    View,
    Modal,
    Text,
    TextInput,
    DatePickerIOS,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    DatePickerAndroid,
    Platform
} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../commonStyles';


const initialState = { description: '', date: new Date() }
export default class AddTask extends Component {
    state = { ...initialState };

    save = () => {
        if(!this.state.description.trim()){
            Alert.alert('Dados invalidos', 'Informe uma descrição para a tarefa');
            return
        }
        const data = { ...this.state };
        this.props.onSave(data);
        this.setState({ ...initialState });
    };

    handleDateAndroidChanged = () => {
        DatePickerAndroid.open({
            date: this.state.date
        }).then(e => {
            if (e.action !== DatePickerAndroid.dismissedAction){
                const momentDate = moment(this.state.date)
                momentDate.date(e.day)
                momentDate.month(e.month)
                momentDate.year(e.year)
                this.setState({ date: momentDate.toDate() })
            }
        })
    }
    render() {
        let datePicker = null;
        if (Platform.OS === 'ios'){
            datePicker = <DatePickerIOS mode='date' date={this.state.date}
            onDateChange={date => this.setState({ date })}></DatePickerIOS>
        } else {
            datePicker = (
                <TouchableOpacity onPress={this.handleDateAndroidChanged}>
                    <Text style={styles.date}>
                        {moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')}
                    </Text>
                </TouchableOpacity>
            )
        }
        return (
            <Modal onRequestClose={this.props.onCancel}
                visible={this.props.isVisible}
                animationType='slide' transparent={true}>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.offset}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>Nova tarefa</Text>
                    <TextInput placeholder="Descrição..." style={styles.input}
                        onChangeText={description => this.setState({ description })}
                        value={this.state.description}>
                    </TextInput>
                   {datePicker}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.offset}></View>
                </TouchableWithoutFeedback>
            </Modal>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    offset: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.default
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.default,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 15
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        width: '90%',
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#e3e3e3'
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft:10,
        marginTop: 10,
        textAlign: 'center'
    }
})