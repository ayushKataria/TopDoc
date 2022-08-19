from elasticsearch import Elasticsearch
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from index_mappings import doctor_mappings, schedule_mappings, user_mappings
import os

es_db = Elasticsearch("https://localhost:9200", basic_auth=('elastic', 'cmlflG69YzfuZMgN=DUb'), verify_certs=False, ssl_show_warn=False)

indices_instructions = {
    "doctor": {
        "old_version": "v1",
        "new_version": "v4",
        "create": True,
        "reindex_alias": False,
        "reindex": False,
        "alias": False,
        "mapping": doctor_mappings
    },
    "schedule": {
        "old_version": "v1",
        "new_version": "v4",
        "create": True,
        "reindex_alias": False,
        "reindex": False,
        "alias": False,
        "mapping": schedule_mappings
    },
    "user": {
        "old_version": "v1",
        "new_version": "v2",
        "create": True,
        "reindex_alias": False,
        "reindex": False,
        "alias": False,
        "mapping": user_mappings
    }
}

for index, instruction in indices_instructions.items():
    if instruction["create"]:
        print(f"Creating index for {index}_{instruction['new_version']}")
        es_db.indices.create(index = index + f"_{instruction['new_version']}", mappings = instruction['mapping']['mappings']) 
    
    if instruction["reindex_alias"]:
        print(f"Reindex from {index}_{instruction['old_version']} to {index}_{instruction['new_version']}")
        es_db.reindex(source = {
                "index": f"{index}_{instruction['old_version']}"
            },
            dest = {
                "index": f"{index}_{instruction['new_version']}"
        })

        print(f"Transfering alias from {index}_{instruction['old_version']} to {index}_{instruction['new_version']}")
        es_db.indices.update_aliases(actions = [
                { "add":    { "index": f"{index}_{instruction['new_version']}", "alias": index }}, 
                { "remove": { "index": f"{index}_{instruction['old_version']}", "alias": index  }}
        ])
    
    if instruction['reindex']:
        print(f"Reindex from {index}_{instruction['old_version']} to {index}_{instruction['new_version']}")
        es_db.reindex(source = {
                "index": f"{index}_{instruction['old_version']}"
            },
            dest = {
                "index": f"{index}_{instruction['new_version']}"
        })
    
    if instruction['alias']:
        print(f"Addind alias to {index}_{instruction['new_version']}")
        es_db.indices.update_aliases(actions = [
                { "add":    { "index": f"{index}_{instruction['new_version']}", "alias": index }}
        ])