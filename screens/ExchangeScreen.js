import React ,{Component} from 'react';
import {Alert, KeyboardAvoidingView, Text,TextInput,TouchableOpacity,View,StyleSheet} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../component/MyHeader'

export default class ExchangeScreen extends Component{
    constructor(){
        super()
        this.state={
            itemName:'',
            description:'',
            userName:firebase.auth().currentUser.email,
            IsItemRequestActive : "",
            requestedItemName: "",
            exchangeStatus:"",
            exchangeId:"",
            userDocId: '',
            docId :''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    addItem=(itemName, description)=>{
        var userName = this.state.userName
        var randomExchange = this.createUniqueId()
        db.collection("exchange_requests").add({
            "user_name":userName,
            "item_name":itemName,
            "description":description,
            "exchange_id":randomExchange
        })
          this.getItemRequest()
        db.collection('users').where("email_address","==",userName).get()
        .then()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    IsItemRequestActive: true
                })
            })
        })
        this.setState({
            itemName:'',
            description:''
        })
        return Alert.alert(
            'Item ready to exchange',
            '',
            [
                {text:'OK', onPress:()=>{
                    this.props.navigation.navigate('HomeScreen')
                }}
            ]
        );
    }

    getItemRequest=()=>{
        var itemRequest =  db.collection('exchange_requests').where('user_name','==',this.state.userName).get()
        .then(SnapShot=>{
          SnapShot.forEach(doc=>{
            if(doc.data().exchange_status!=='received'){
              this.setState({
                exchangeId:doc.data().exchange_id,
                requestedItemName:doc.data().item_name,
                exchangeStatus:doc.data().exchange_status,
                docId:doc.id
              })
            }
          })
        })
    }
    
    getIsItemRequestActive(){
        db.collection('users').where('email_address','==',this.state.userName).onSnapshot(querySnapShot=>{
          querySnapShot.forEach(doc=>{
            this.setState({
              IsItemRequestActive:doc.data().IsItemRequestActive,
              userDocId:doc.id
            })
          })
        })
    }
    
    sendNotification=()=>{
        db.collection('users').where('email_address','==',this.state.userName).get()
        .then(SnapShot=>{
          SnapShot.forEach(doc=>{
            var name = doc.data().first_name
            var lastName = doc.data().last_name
            
            db.collection('all_notifications').where('exchange_id','==',this.state.exchangeId).get()
            .then(SnapShot=>{
              SnapShot.forEach(doc=>{
                var exchangerId  = doc.data().exchanger_id
                var itemName = doc.data().item_name
                
                db.collection('all_notifications').add({
                  targeted_user_id:exchangerId,
                  message:name+' '+ lastName+ " received the book " + itemName,
                  notification_status:'unread',
                  item_name:itemName
                })
              })
            })
          })
        })
    
    }
    
    updateItemRequestStatus=()=>{
        db.collection('exchange_requests').doc(this.state.docId).update({
          exchange_status:'received'
        })
        db.collection('users').where('email_address','==',this.state.userName).get()
        .then(SnapShot=>{
          SnapShot.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              IsItemRequestActive:false
            })
          })
        })
    }
    
    receivedItems =(itemName)=>{
        var userName = this.state.userName
        var exchangeId = this.state.exchangeId
        db.collection('received_items').add({
          user_name:userName,
          item_name:itemName,
          exchange_id:exchangeId,
          exchange_status:'received'
        })
    }
    
    componentDidMount(){
        this.getItemRequest()
        this.getIsItemRequestActive()
    }

    render(){
        if(this.state.IsItemRequestActive===true){
            return(
              <View style = {{flex:1,justifyContent:'center'}}>
                <View style = {{borderColor:'orange',borderWidth:2,justifyContent:'center',padding:10,margin:10,alignItems:'center'}}>
                  <Text>Item Name</Text>
                  <Text>{this.state.requestedItemName}</Text>
                </View>
                <View style = {{borderColor:'orange',borderWidth:2,justifyContent:'center',padding:10,margin:10,alignItems:'center'}}>
                  <Text>Exchange Status</Text>
                  <Text>{this.state.exchangeStatus}</Text>
                  <TouchableOpacity style = {{borderWidth:1,borderColor:'orange',backgroundColor:'órange',width:300,alignItems:'center',alignSelf:'center',marginTop:30,height:30}}
                  onPress={()=>{
                    this.sendNotification()
                    this.updateItemRequestStatus()
                    this.receivedItems(this.state.requestedItemName)
                  }}>
                    <Text>I have Received the Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
        }
        else{
            return(
                <View style = {{flex:1}}>
                    <MyHeader title = 'Add Item'/>
                    <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                        <TextInput style = {styles.itemInfo}
                        placeholder = {'Item Name'}
                        onChangeText = {(text)=>{
                            this.setState({itemName:text})
                        }}
                        value = {this.state.itemName}/>

                        <TextInput style = {styles.itemInfo}
                        placeholder = {'Description'}
                        onChangeText = {(text)=>{
                            this.setState({description:text})
                        }}
                        value = {this.state.description}/>

                        <TouchableOpacity style = {[styles.button,{marginTop:10}]}
                        onPress = {()=>{
                            this.addItem(this.state.itemName,this.state.description)
                        }}>
                            <Text style = {{color:'white',fontSize:18,fontWeight:'bold'}}>ADD ITEM</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    itemInfo:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10,
    },
    button:{
        width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    
    },
})