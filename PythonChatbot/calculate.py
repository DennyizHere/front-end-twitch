import json
import requests

response =requests.get('https://api.twitch.tv/kraken/streams/gamesdonequick?client_id=0ecb43trffudcqwxflq1k13ivl9rlv')
data = response.json()
viewers = data["stream"]["viewers"]
threshhold = int(viewers / 10000)
print(threshhold)

