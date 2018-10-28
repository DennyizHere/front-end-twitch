import json
import requests

channel_ID = "232951285"

data = json.loads(requests.get("https://api.twitch.tv/kraken/streams/" + channel_ID).text)

viewers = data["stream"]["viewers"]
threshhold = viewers / 10

