doctor_mappings = {
    "mappings": {
        "properties": {
            "profImageUrl": {
                "enabled": False
            },
            "reviewTags": {
                "type": "nested",
                "properties": {
                    "tagName": {
                        "type": "keyword"
                    },
                    "description": {
                        "type": "keyword"
                    }
                }
            },
            "noOfReviews" : {
            "type" : "long"
            },
            "consultations": {
                "type": "long"
            },
            "satisfiedPatients": {
                "type": "long"
            },
            "awardsAndPublications": {
                "type": "nested",
                "properties": {
                    "awardName": {
                        "type": "keyword"
                    },
                    "place": {
                        "type": "keyword"
                    },
                    "date": {
                        "type": "date",
                        "format": "basic_date_time_no_millis"
                    }
                }
            },
            "associatedClinics": {
                "type": "nested",
                "properties": {
                    "clinicName": {
                        "type": "keyword"
                    },
                    "clinicRating": {
                        "type": "double"
                    },
                    "location": {
                        "type": "keyword"
                    },
                    "fees": {
                        "type": "float"
                    },
                    "tagReceived": {
                        "type": "keyword"
                    },
                    "schedule": {
                        "type": "nested",
                        "properties": {
                            "from": {
                                "type": "keyword"
                            },
                            "to": {
                                "type": "keyword"
                            },
                            "duration": {
                                "type": "keyword"
                            }
                        }
                    }
                }
            },
            "address": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "ailmentsTreated": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "averageRating": {
                "type": "double"
            },
            "city": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "country": {
                "type": "keyword"
            },
            "designation": {
                "type": "keyword"
            },
            "education": {
                "type": "nested",
                "properties": {
                        "degree": {
                            "type": "keyword"
                        },
                    "description": {
                            "type": "keyword"
                    },
                    "endDate": {
                            "type": "date",
                            "format": "basic_date_time_no_millis"
                    },
                    "fieldOfStudy": {
                            "type": "keyword"
                    },
                    "institute": {
                            "type": "keyword"
                    },
                    "startDate": {
                            "type": "date",
                            "format": "basic_date_time_no_millis"
                    }
                }
            },
            "email": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "experience": {
                "type": "nested",
                "properties": {
                        "organisation": {
                            "type": "keyword"
                        },
                    "description": {
                            "type": "keyword"
                    },
                    "endDate": {
                            "type": "date",
                            "format": "basic_date_time_no_millis"
                    },
                    "location": {
                            "type": "keyword"
                    },
                    "startDate": {
                            "type": "date",
                            "format": "basic_date_time_no_millis"
                    },
                    "title": {
                            "type": "keyword"
                    }
                }
            },
            "firstName": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "gender": {
                "type": "keyword"
            },
            "hospital": {
                "type": "nested",
                "properties": {
                        "identfier": {
                            "type": "keyword"
                        },
                    "name": {
                            "type": "keyword"
                    }
                }
            },
            "identifier": {
                "type": "keyword"
            },
            "isPersonAllowed": {
                "type": "boolean"
            },
            "isVideoAllowed": {
                "type": "boolean"
            },
            "landmark": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "languages": {
                "type": "keyword"
            },
            "lastName": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "licenses": {
                "type": "nested",
                "properties": {
                        "identifier": {
                            "type": "keyword"
                        },
                    "name": {
                            "type": "keyword"
                    },
                    "provider": {
                            "type": "keyword"
                    }
                }
            },
            "locality": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "location": {
                "type": "geo_point"
            },
            "name": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "phone": {
                "type": "keyword"
            },
            "schedule": {
                "properties": {
                    "monday": {
                        "properties": {
                            "session1_start_time": {
                                "type": "keyword"
                            },
                            "session1_end_time": {
                                "type": "keyword"
                            },
                            "session2_start_time": {
                                "type": "keyword"
                            },
                            "session2_end_time": {
                                "type": "keyword"
                            }
                        }
                    },
                    "tuesday": {
                        "properties": {
                            "session1_start_time": {
                                "type": "keyword"
                            },
                            "session1_end_time": {
                                "type": "keyword"
                            },
                            "session2_start_time": {
                                "type": "keyword"
                            },
                            "session2_end_time": {
                                "type": "keyword"
                            }
                        }
                    },
                    "wednesday": {
                        "properties": {
                            "session1_start_time": {
                                "type": "keyword"
                            },
                            "session1_end_time": {
                                "type": "keyword"
                            },
                            "session2_start_time": {
                                "type": "keyword"
                            },
                            "session2_end_time": {
                                "type": "keyword"
                            }
                        }
                    },
                    "thursday": {
                        "properties": {
                            "session1_start_time": {
                                "type": "keyword"
                            },
                            "session1_end_time": {
                                "type": "keyword"
                            },
                            "session2_start_time": {
                                "type": "keyword"
                            },
                            "session2_end_time": {
                                "type": "keyword"
                            }
                        }
                    },
                    "friday": {
                        "properties": {
                            "session1_start_time": {
                                "type": "keyword"
                            },
                            "session1_end_time": {
                                "type": "keyword"
                            },
                            "session2_start_time": {
                                "type": "keyword"
                            },
                            "session2_end_time": {
                                "type": "keyword"
                            }
                        }
                    },
                    "saturday": {
                        "properties": {
                            "session1_start_time": {
                                "type": "keyword"
                            },
                            "session1_end_time": {
                                "type": "keyword"
                            },
                            "session2_start_time": {
                                "type": "keyword"
                            },
                            "session2_end_time": {
                                "type": "keyword"
                            }
                        }
                    },
                    "sunday": {
                        "properties": {
                            "session1_start_time": {
                                "type": "keyword"
                            },
                            "session1_end_time": {
                                "type": "keyword"
                            },
                            "session2_start_time": {
                                "type": "keyword"
                            },
                            "session2_end_time": {
                                "type": "keyword"
                            }
                        }
                    }
                }
            },
            "specialization": {
                "type": "text",
                "fields": {
                        "keyword": {
                            "type": "keyword"
                        }
                }
            },
            "state": {
                "type": "keyword"
            },
            "yearsOfExperience": {
                "type": "long"
            }
        }
    }
}

schedule_mappings = {
    "mappings": {
        "properties": {
            "address": {
                "type": "keyword"
            },
            "appointmentAttended": {
                "type": "boolean"
            },
            "appointmentId": {
                "type": "keyword"
            },
            "appointmentNumber": {
                "type": "keyword"
            },
            "appointmentTime": {
                "type": "date",
                "format": "basic_date_time_no_millis"
            },
            "doctorComment": {
                "type": "keyword"
            },
            "doctorId": {
                "type": "keyword"
            },
            "hasSeenDoctorBefore": {
                "type": "boolean"
            },
            "location": {
                "type": "geo_point"
            },
            "patientComment": {
                "type": "keyword"
            },
            "patientId": {
                "type": "keyword"
            },
            "reasonForVisit": {
                "type": "keyword"
            },
            "status": {
                "type": "keyword"
            },
            "slotDay": {
                "type": "keyword"
            },
            "slotTime": {
                "type": "keyword"
            },
            "type": {
                "type": "keyword"
            }
        }
    }
}

user_mappings = {
    "mappings": {
        "properties": {
            "DOB": {
                "type": "date",
                "format": "basic_date_time_no_millis"
            },
            "Zipcode": {
                "type": "keyword"
            },
            "address": {
                "type": "text"
            },
            "blood_donor": {
                "type": "boolean"
            },
            "city": {
                "type": "keyword"
            },
            "country": {
                "type": "keyword"
            },
            "email": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "gender": {
                "type": "keyword"
            },
            "id": {
                "type": "keyword"
            },
            "insurance_details": {
                "properties": {
                    "coverage": {
                        "properties": {
                            "end_date": {
                                "type": "date",
                                "format": "basic_date_time_no_millis"
                            },
                            "start_date": {
                                "type": "date",
                                "format": "basic_date_time_no_millis"
                            }
                        }
                    },
                    "documents": {
                        "type": "keyword"
                    },
                    "id": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "provider": {
                        "type": "keyword"
                    }
                }
            },
            "isPremiumUser": {
                "type": "boolean"
            },
            "landmark": {
                "type": "text"
            },
            "language": {
                "type": "keyword"
            },
            "locality": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "medical_records": {
                "properties": {
                    "alcohol_user": {
                        "type": "text"
                    },
                    "allergies": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "blood_group": {
                        "type": "keyword"
                    },
                    "drug_user": {
                        "type": "text"
                    },
                    "past_procedures": {
                        "properties": {
                            "date": {
                                "type": "date",
                                "format": "basic_date_time_no_millis"
                            },
                            "name": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            }
                        }
                    },
                    "pre_existing_conditions": {
                        "properties": {
                            "duration": {
                                "type": "float"
                            },
                            "name": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            }
                        }
                    },
                    "smoker": {
                        "type": "text"
                    }
                }
            },
            "mobile": {
                "type": "keyword"
            },
            "name": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "role": {
                "type": "text"
            },
            "state" : {
            "type" : "keyword"
            },
            "medicalDetails" :{
                "type":"nested",
                "properties" :{
                    "name":{
                        "type":"keyword"
                    },
                    "bmi":{
                        "type" :"float"  
                    },
                    "heartRate":{
                        "type":"float"
                    },
                    "fbcStatus":{
                        "type":"long"
                    },
                    "fbcStatus": {
                        "type": "long"
                    },
                    "orderDate":{
                    "type" : "date",
                    "format" : "basic_date_time_no_millis"
                    }
                }
            }
        }
    }
}



review_mappings = {
    "mappings": {
        "properties": {
              "reviewRating": {
                "type": "double"
            },
            "reviewMessage": {
                "type": "text"
            },
            "reviewDate" : {
            "type" : "date",
            "format" : "basic_date_time_no_millis"
            },
            "userId" : {
            "type" : "keyword"
            },
            "userName" : {
            "type" : "text",
            "fields" : {
                "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
                }
            }
            },
            "isVerifiedUser": {
                "type": "boolean"
            },
             "doctorId": {
                "type": "keyword"
            },
            "reviewlastEditedOn" : {
            "type" : "date",
            "format" : "basic_date_time_no_millis"
            },
             "userScheduleId": {
                "type": "keyword"
            },
            "accurateDiagnosisRating": {
                "type": "double"
            },
            "friendlinessAndWaitTimeRating": {
                "type": "double"
            },
            "bedsideMannerismRating": {
                "type": "double"
            },
            "staffCourteousnessRating": {
                "type": "double"
            },
            "patientEducationRating": {
                "type": "double"
            }
        }
    }
}







































































