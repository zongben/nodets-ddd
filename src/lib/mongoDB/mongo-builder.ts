import { Model } from "mongoose";

export class MongoBuilder {
  private pipeline: any = [];
  private model: Model<any>;

  private constructor(model: Model<any>) {
    this.model = model;
  }

  static create(model: Model<any>) {
    return new MongoBuilder(model);
  }

  //match example: { account: "admin" }
  Where(predict: any) {
    this.pipeline.push({ $match: predict });
    return this;
  }

  //lookup example: { from: "user", localField: "account", foreignField: "account", as: "user" }
  Lookup(from: string, localField: string, foreignField: string, as: string) {
    this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
    return this;
  }

  //left join example: { from: "user", localField: "account", foreignField: "account", as: "user" }
  LeftJoin(from: string, localField: string, foreignField: string, as: string) {
    this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
    this.pipeline.push({
      $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true },
    });
    return this;
  }

  //inner join example: { from: "user", localField: "account", foreignField: "account", as: "user" }
  InnerJoin(
    from: string,
    localField: string,
    foreignField: string,
    as: string,
  ) {
    this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
    this.pipeline.push({
      $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: false },
    });
    return this;
  }

  //project example: { account: 1, username: 1, password: 0 }
  Project(project: any) {
    this.pipeline.push({ $project: project });
    return this;
  }

  async Query() {
    return await this.model.aggregate(this.pipeline);
  }

  async QueryFirstOrDefault() {
    const result = await this.model.aggregate(this.pipeline);
    return result.length > 0 ? result[0] : null;
  }

  Pipe(pipeline: any) {
    this.pipeline.push(pipeline);
    return this;
  }

  //group example: { _id: "$account", count: { $sum: 1 } }
  GroupBy(group: any) {
    this.pipeline.push({ $group: group });
    return this;
  }

  //sort example: { account: 1, username: -1 }
  Sort(sort: any) {
    this.pipeline.push({ $sort: sort });
    return this;
  }

  Limit(limit: number) {
    this.pipeline.push({ $limit: limit });
    return this;
  }

  Skip(skip: number) {
    this.pipeline.push({ $skip: skip });
    return this;
  }

  Unwind(prop: any) {
    this.pipeline.push({ $unwind: prop });
    return this;
  }
}
