import json

channel_ID = "232951285"

with open('https://api.twitch.tv/kraken/streams/' + channel_ID) as info:
    data = json.load(info)

viewers = data["stream"]["viewers"]
threshhold = viewers / 10

