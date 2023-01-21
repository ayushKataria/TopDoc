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
  "medical_details",
  "userScheduleId",
  "accurateDiagnosisRating",
  "friendlinessAndWaitTimeRating",
  "bedsideMannerismRating",
  "staffCourteousnessRating",
  "patientEducationRating",
];

const doctorUpdateAttributes = [
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
  "practiceStaff",
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
  "district",
  "password",
  "pin",
  "awardsAndPublications",
  "associatedClinics",
];

const getRequestAttributes = ["role", "doctorId", "fields"];

const sortListForReview = ["reviewRating", "reviewDate", "reviewlastEditedOn"];

const getRequestReviewAttributes = [
  "role",
  "doctorId",
  "pageSize",
  "pageNo",
  "userId",
  "sort",
];

const createNewStaffAttributes = [
  "mappedTo",
  "email",
  "designation",
  "mobile",
  "lastName",
  "firstName",
  "role",
];

module.exports = {
  userReviewsAttributes,
  doctorUpdateAttributes,
  getRequestAttributes,
  sortListForReview,
  getRequestReviewAttributes,
  createNewStaffAttributes,
};
