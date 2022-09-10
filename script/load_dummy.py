from elasticsearch import Elasticsearch
import json
import sys
import os

sys.path.insert(1, os.path.split(os.getcwd())[0] + '/DummyData')

es_db = Elasticsearch("https://localhost:9200", basic_auth=('', ''), verify_certs=False, ssl_show_warn=False)

doctor_data = []
user_data = []

with open("./DummyData/doctors.json", "r") as file:
    doctor_data = json.load(file)

with open("./DummyData/users.json", "r") as file:
    user_data = json.load(file)

for doctor in doctor_data:
    es_db.index(index = "doctor", document=doctor)

# for user in user_data:
#     es_db.index(index = "user", document=doctor)