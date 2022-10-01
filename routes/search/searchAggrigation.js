const aggsDisplayName = {
  cityAggs: "Cities",
  languagesAggs: "Languages",
  specializationAggs: "Specialization",
  genderAggs: "Gender",
  countryAggs: "Countries",
  yearsOfExperienceAggs: "Experience",
  averageRatingAggs: "Rating",
};
function aggegrationsData(aggsMetaData) {
  try {
    delete aggsMetaData.doc_count;
    console.log("Aggregation data func called", aggsMetaData);
    let aggsDataList = [];
    console.log(aggsMetaData);

    for (var obj in aggsMetaData) {
      if (obj in aggsDisplayName) {
        let aggsFilter = {
          displayName: "",
          type: "",
          content: [],
        };
        aggsFilter.type = obj.replace("Aggs", "");
        aggsFilter.displayName = aggsDisplayName[obj];
        let aggsData = aggsMetaData[obj][obj];
        //to handle nested aggs case
        if (aggsData.hasOwnProperty(obj)) {
          console.log("indise fiif");
          aggsData = aggsData[obj];
        }
        aggsData = aggsData.buckets;
        let contentList = [];
        if (aggsData.length > 0) {
          for (let value of aggsData) {
            let aggsContent = {};
            //creating content for average rating
            if (obj == "averageRatingAggs") {
              // Rating aggs
              aggsContent.displayName = value.key;
              aggsContent.from = value.from;
              aggsContent.to = value.to;
              aggsContent.count = value.doc_count;
            } else if (obj == "genderAggs") {
              //gender aggregations
              aggsContent = {};
              //creating content for average rating
              aggsContent.displayName = value.key;
              //   aggsContent.from=value.from
              //aggsContent.to=value.to
              aggsContent.count = value.doc_count;
            } else if (obj == "languagesAggs") {
              //Language aggregations
              console.log("Value in lang is ", value);
              aggsContent = {};
              //creating content for average rating
              aggsContent.displayName = value.key;
              //   aggsContent.from=value.from
              //aggsContent.to=value.to
              aggsContent.count = value.doc_count;
            } else if (obj == "cityAggs") {
              //city aggregations
              aggsContent = {};
              //creating content for average rating
              aggsContent.displayName = value.key;
              //   aggsContent.from=value.from
              //aggsContent.to=value.to
              aggsContent.count = value.doc_count;
            } else if (obj == "specializationAggs") {
              //Specialization aggregations
              aggsContent = {};
              //creating content for average rating
              aggsContent.displayName = value.key;
              //   aggsContent.from=value.from
              //aggsContent.to=value.to
              aggsContent.count = value.doc_count;
            } else if (obj == "countryAggs") {
              //Countyr aggregations
              aggsContent = {};
              //creating content for average rating
              aggsContent.displayName = value.key;
              //   aggsContent.from=value.from
              //aggsContent.to=value.to
              aggsContent.count = value.doc_count;
            } else if (obj == "yearsOfExperienceAggs") {
              //Experience aggregations
              aggsContent = {};
              //creating content for average rating
              aggsContent.displayName = value.key;
              //   aggsContent.from=value.from
              //aggsContent.to=value.to
              aggsContent.count = value.doc_count;
            } else {
              aggsContent.displayName = value["key"];
              aggsContent.type = value["key"];
            }

            aggsContent.count = value["doc_count"];
            contentList.push(aggsContent);
          }
        }
        if (contentList.length > 0) {
          aggsFilter.content = contentList;
          aggsDataList.push(aggsFilter);
        }
      }
    }
    // console.log("aggsDataList is ", JSON.stringify(aggsDataList));
    return aggsDataList;
  } catch (error) {
    log.error("error", error);
    throw error.toString();
  }
}

module.exports = {
  aggegrationsData,
};
