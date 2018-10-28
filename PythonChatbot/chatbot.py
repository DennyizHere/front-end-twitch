'''
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
'''

import irc.bot
import calculate

class TwitchBot(irc.bot.SingleServerIRCBot):
    def __init__(self, username, client_id, token, channel):
        self.client_id = client_id
        self.token = token
        self.channel = '#' + channel
        self.emotesArray = ['PogChamp']
        self.emotes = {}
        for e in self.emotesArray:
            self.emotes[e] = {
                'count': 0,
                'sound': ''
            }

        # Create IRC bot connection
        server = 'irc.chat.twitch.tv'
        port = 6667
        print('Connecting to ' + server + ' on port ' + str(port) + '...')
        irc.bot.SingleServerIRCBot.__init__(self, [(server, port, 'oauth:' + token)], username, username)

    def on_welcome(self, c, e):
        print('Joining ' + self.channel)

        # You must request specific capabilities before you can use them
        c.cap('REQ', ':twitch.tv/membership')
        c.cap('REQ', ':twitch.tv/tags')
        c.cap('REQ', ':twitch.tv/commands')
        c.join(self.channel)

    def on_pubmsg(self, c, e):
        msg = e.arguments[0]
        msg_array = msg.split()
        for word in msg_array:
            if word in self.emotesArray:
                self.emotes[word]['count'] += 1
                print(self.emotes)
                break
        for emote in self.emotesArray:
            if self.emotesArray[emote]['count'] >= calculate.threshhold:
                # play sound
                self.emotesArray[emote]['count'] = 0

def main():
    username = 'xjavathehutt'
    client_id = 'RsjMUhqNxUOfd1mFGxqKlS4G6qUpJd'
    token = 'nv302jy8evfym8lbbtnzvqh3dtucxs'
    channel = 'xjavathehutt'

    bot = TwitchBot(username, client_id, token, channel)
    bot.start()


if __name__ == "__main__":
    main()
