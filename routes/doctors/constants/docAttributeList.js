

 
const userReviewsAttributes = [ 
    "role",
 "reviewRating",
 "reviewMessage",
 "reviewDate",
 "userId",
 "userName",
 "isVerifiedUser",
 "doctorId",
 "reviewlastEditedOn",
 "userScheduleId",
  "accurateDiagnosisRating",
 "friendlinessAndWaitTimeRating",
 "bedsideMannerismRating",
 "staffCourteousnessRating",
"patientEducationRating"
]

const doctorProfileAttributes=
[ 
    "address",
    "ailmentsTreated",
    "averageRating",
    "city",
    "country",
    "designation",
    "education",
    "email",
    "experience",
    "firstName",
    "gender",
    "hospital",
    "identifier",
    "isPersonAllowed",
    "isVideoAllowed",
    "landmark",
    "languages",
    "lastName",
    "licenses",
    "locality",
    "location",
    "name",
    "phone",
    "schedule",
    "specialization",
    "state",
    "yearsOfExperience",
    "id",
    "role",
    "docImageUrl",
    "tags",
    "noOfReviews",
    "consultations",
    "satisfiedPatients",
    "awardsAndPublications",
    "associatedClinics"
    ]

    const getRequestAttributes = [ 
     "role",
     "doctorId",
     "fields"
    ]

    const sortListForReview = [
        "reviewRating",
        "reviewDate",
        "reviewlastEditedOn"
      ];

      const getRequestReviewAttributes = [ 
        "role",
        "doctorId",
        "pageSize",
        "pageNo",
        "userId",
        "sort"
       ]
    


module.exports = {userReviewsAttributes,doctorProfileAttributes,getRequestAttributes,sortListForReview,getRequestReviewAttributes}



// module.exports = () => ([ 
//     "address",
//     "ailmentsTreated",
//     "averageRating",
//     "city",
//     "country",
//     "designation",
//     "education",
//     "email",
//     "experience",
//     "firstName",
//     "gender",
//     "hospital",
//     "identifier",
//     "isPersonAllowed",
//     "isVideoAllowed",
//     "landmark",
//     "languages",
//     "lastName",
//     "licenses",
//     "locality",
//     "location",
//     "name",
//     "phone",
//     "schedule",
//     "specialization",
//     "state",
//     "yearsOfExperience",
//     "id",
//     "role",
//     "docImageUrl",
//     "tags",
//     "noOfReviews",
//     "consultations",
//     "satisfiedPatients",
//     "awardsAndPublications",
//     "associatedClinics",

// ])

