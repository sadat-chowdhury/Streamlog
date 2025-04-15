import requests

url = "https://us-east1-white-faculty-456816-n9.cloudfunctions.net/get_recommendations"
data = { "title": "Inception" }

response = requests.post(url, json=data)
print(response.json())
