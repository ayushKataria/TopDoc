doctor_mappings = {
    "mappings": {
        "properties": {
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
                            "type": "date"
                    },
                    "fieldOfStudy": {
                            "type": "keyword"
                    },
                    "grade": {
                            "type": "keyword"
                    },
                    "school": {
                            "type": "keyword"
                    },
                    "startDate": {
                            "type": "date"
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
                        "comapanyName": {
                            "type": "keyword"
                        },
                    "description": {
                            "type": "keyword"
                    },
                    "endDate": {
                            "type": "date"
                    },
                    "location": {
                            "type": "keyword"
                    },
                    "startDate": {
                            "type": "date"
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
                    "day": {
                        "type": "keyword"
                    },
                    "slotTimeInMinutes": {
                        "type": "long"
                    },
                    "workingTime": {
                        "properties": {
                            "endTime": {
                                "type": "date",
                                "format": "basic_time_no_millis"
                            },
                            "startTime": {
                                "type": "date",
                                "format": "basic_time_no_millis"
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
            "type": {
                "type": "keyword"
            }
        }
    }
}

user_mappings = {
    "mappings" : {
        "properties" : {
            "DOB" : {
                "type" : "date",
                "format" : "dd/mm/yyyy"
            },
            "Zipcode" : {
                "type" : "keyword"
            },
            "address" : {
                "type" : "text"
            },
            "blood_donor" : {
                "type" : "boolean"
            },
            "city" : {
                "type" : "keyword"
            },
            "country" : {
                "type" : "keyword"
            },
            "email" : {
            "type" : "text",
            "fields" : {
                "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
                }
            }
            },
            "gender" : {
            "type" : "keyword"
            },
            "id" : {
            "type" : "keyword"
            },
            "insurance_details" : {
            "properties" : {
                "coverage" : {
                "properties" : {
                    "end_date" : {
                    "type" : "date",
                    "format" : "dd/mm/yyyy"
                    },
                    "start_date" : {
                    "type" : "date",
                    "format" : "dd/mm/yyyy"
                    }
                }
                },
                "documents" : {
                "type" : "keyword"
                },
                "id" : {
                "type" : "text",
                "fields" : {
                    "keyword" : {
                    "type" : "keyword",
                    "ignore_above" : 256
                    }
                }
                },
                "provider" : {
                "type" : "keyword"
                }
            }
            },
            "isPremiumUser" : {
            "type" : "boolean"
            },
            "landmark" : {
            "type" : "text"
            },
            "language" : {
            "type" : "keyword"
            },
            "locality" : {
            "type" : "text",
            "fields" : {
                "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
                }
            }
            },
            "medical_records" : {
            "properties" : {
                "alcohol_user" : {
                "type" : "boolean"
                },
                "allergies" : {
                "type" : "text",
                "fields" : {
                    "keyword" : {
                    "type" : "keyword",
                    "ignore_above" : 256
                    }
                }
                },
                "blood_group" : {
                "type" : "keyword"
                },
                "drug_user" : {
                "type" : "boolean"
                },
                "past_procedures" : {
                "properties" : {
                    "date" : {
                    "type" : "date",
                    "format" : "dd/mm/yyyy"
                    },
                    "name" : {
                    "type" : "text",
                    "fields" : {
                        "keyword" : {
                        "type" : "keyword",
                        "ignore_above" : 256
                        }
                    }
                    }
                }
                },
                "pre_existing_conditions" : {
                "properties" : {
                    "duration" : {
                    "type" : "float"
                    },
                    "name" : {
                    "type" : "text",
                    "fields" : {
                        "keyword" : {
                        "type" : "keyword",
                        "ignore_above" : 256
                        }
                    }
                    }
                }
                },
                "smoker" : {
                "type" : "boolean"
                }
            }
            },
            "mobile" : {
            "type" : "keyword"
            },
            "name" : {
            "type" : "text",
            "fields" : {
                "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
                }
            }
            },
            "role" : {
            "type" : "text"
            },
            "state" : {
            "type" : "keyword"
            }
        }
    }
}

