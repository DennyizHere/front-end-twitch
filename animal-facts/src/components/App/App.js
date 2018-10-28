import React from 'react'
import Authentication from '../Authentication/Authentication'

import './App.css'

const tmi = require('tmi.js')
const haikudos = require('haikudos')
const commandPrefix = '!'
const opts = {
  identity: {
    username: 'Twitch',
    password: 'oauth:' + 'vgskj4w6iv77j3cgiikqqotg32jphn'
  },
  channels: [
    'xjavathehutt'
  ]
}
const emotes = ['PogChamp', 'X']
const values = {}

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.Authentication = new Authentication()

    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state={
      finishedLoading:false,
      theme:'light',
      animal:'',
      fact:''
    }
    for(const key in emotes){
      var emote = emotes[key]
      values[emote] = {
        count: 0,
        soundFile: null
      }
    }
    console.log(values)
  }

  // Called every time a message comes in:
  onMessageHandler (target, context, msg, self) {
    if (self) { return } // Ignore messages from the bot

    const parse = msg.split(' ')

    for(var i in parse){
      var word = parse[i]
      console.log(word)
      if(emotes.indexOf(word) >= 0){
        values[word].count++
        console.log(values)
        break
      }
    }
    // The command name is the first (0th) one:
    // const commandName = parse[0]
    // The rest (if any) are the parameters:
    // const params = parse.splice(1)

    // If the command is known, let's execute it:
    // if (commandName in knownCommands) {
    //   // Retrieve the function by its name:
    //   const command = knownCommands[commandName]
    //   // Then call the command with parameters:
    //   command(target, context, params)
    //   console.log(`* Executed ${commandName} command for ${context.username}`)
    // } else {
    //   console.log(`* Unknown command ${commandName} from ${context.username}`)
    // }
  }

  // Called every time the bot connects to Twitch chat:
  onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
  }
  // Called every time the bot disconnects from Twitch:

  onDisconnectedHandler (reason) {
    console.log(`Disconnected: ${reason}`)
    process.exit(1)
  }
  contextUpdate(context, delta){
    if(delta.includes('theme')){
      this.setState(()=>{
        return {theme:context.theme}
      })
    }
  }

  componentDidMount(){
    if(this.twitch){
      this.twitch.onAuthorized((auth)=>{
        this.Authentication.setToken(auth.token, auth.userId)

        if(!this.state.finishedLoading){
          this.setState(()=>{
            return {finishedLoading:true}
          })
        }
      })

      let client = new tmi.client(opts)

      // Register our event handlers (defined below):
      client.on('message', this.onMessageHandler)
      client.on('connected', this.onConnectedHandler)
      client.on('disconnected', this.onDisconnectedHandler)

      // Connect to Twitch:
      client.connect()
      this.twitch.onContext((context,delta)=>{
        this.contextUpdate(context,delta)
      })

      this.twitch.configuration.onChanged(()=>{
        let animal = this.twitch.configuration.broadcaster ? this.twitch.configuration.broadcaster.content : ''
        let fact = this.twitch.configuration.developer ? this.twitch.configuration.developer.content : ''

        this.setState(()=>{
          return{
            animal,
            fact
          }
        })
      })
    }
  }

  componentWillUnmount(){
    if(this.twitch){
      this.twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
    }
  }

  render(){
    if(this.state.finishedLoading && this.state.animal && this.state.fact){
      return (
        <div className={this.state.theme === 'light' ? "App App-light" : "App App-dark"}>
        <p>Random fact about {this.state.animal}s!</p>
        <p>Did you know that: {this.state.fact}</p>
        </div>
      )
    }
    else if(this.state.finishedLoading){
      return(
        <div className={this.state.theme === 'light' ? "App App-light" : "App App-dark"}>
        Extension not configured.
        </div>
      )
    }
    else{
      return (
        <div className="App">
        Loading...
        </div>
      )
    }
  }
}
