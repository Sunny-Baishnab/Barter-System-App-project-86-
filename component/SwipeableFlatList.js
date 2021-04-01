import React ,{Component} from 'react';
import {Text,View,Dimensions,StyleSheet,Animated} from 'react-native';
import db from '../config';
import firebase from 'firebase'
import { ListItem,Icon } from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';

export default class SwipeableFlatList extends Component{
    constructor(props){
        super(props);
        this.state={
            allNotifications:this.props.allNotifications
        }
    }
    updateMarkAsRead=(notification)=>{
        db.collection('all_notifications').doc(notification.doc_id).update({
            "notification_status" : 'read'
        })
    }
    onSwipeValueChange=(swipeData)=>{
        var allNotifications = this.state.allNotifications;
        const {key,value}=swipeData
        if(value<-Dimensions.get('window').width){
            const newData = [...allNotifications]
            this.updateMarkAsRead(allNotifications[key])
            newData.splice(key,1)
            this.setState({
                allNotifications:newData
            })
        }
    }
    
    renderItem=data=>{
        <Animated.View>
        <ListItem 
        leftElement = {<Icon name = 'book' type = 'font-awesome' color = '#696969'/> }
        title = {data.item.book_name}
        titleStyle = {{color:'black',fontWeight:'bold'}}
        subtitle = {data.item.message}
        bottomDivider
        />
        </Animated.View>
    }
    renderHiddenItem=()=>{
        <View style = {styles.rowBack}>
            <View style = {[styles.backRightButton,styles.backRightButtonRight]}>
                <Text style = {styles.backTextWhite}>Mark as Read</Text>
            </View>
        </View>
    }
    render(){
        return(
            <View style = {styles.container}>
                <SwipeListView disableRightSwipe
                data = {this.state.allNotifications}
                renderItem = {this.renderItem}
                renderHiddenItem = {this.renderHiddenItem}
                rightOpenValue = {-Dimensions.get('window').width}
                previewRowKey = {'0'}
                previewOpenValue = {-40}
                previewOpenDelay = {3000}
                onSwipeValueChange = {this.onSwipeValueChange}
                keyExtractor = {(item,index)=>index.toString()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'color'
    },
    rowBack:{
        alignItems:'center',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:15,
        backgroundColor:'orange'
    },
    backRightButton:{
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:0,
        top:0,
        width:100
    },
    backRightButtonRight:{
        backgroundColor:'red',
        right:0
    },
    backTextWhite:{
        color:'red',
        fontWeight:'bold',
        fontSize:20,
        textAlign:'center',
        alignSelf:'flex-start'
    }
})