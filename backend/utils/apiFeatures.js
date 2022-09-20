class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryStringCopy = { ...this.queryString };
    const removeKeywords = ["keyword", "page"];
    removeKeywords.forEach((removeKW) => delete queryStringCopy[removeKW]);

    let query_str = JSON.stringify(queryStringCopy);

    query_str = query_str.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(query_str));
    return this;
  }

  pagination(resultsPerPage = 10) {
    const skip = resultsPerPage * (parseInt(this.queryString.page) - 1);

    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
