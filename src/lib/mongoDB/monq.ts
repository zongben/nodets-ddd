import { Model } from "mongoose";

export class Monq {
  private pipeline: any = [];
  private model: Model<any>;

  private constructor(model: Model<any>) {
    this.model = model;
  }

  static create(model: Model<any>) {
    return new Monq(model);
  }

  //match example: { account: "admin" }
  where(predict: any) {
    this.pipeline.push({ $match: predict });
    return this;
  }

  //lookup example: { from: "user", localField: "account", foreignField: "account", as: "user" }
  lookup(from: string, localField: string, foreignField: string, as: string) {
    this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
    return this;
  }

  //left join example: { from: "user", localField: "account", foreignField: "account", as: "user" }
  leftJoin(from: string, localField: string, foreignField: string, as: string) {
    this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
    this.pipeline.push({
      $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true },
    });
    return this;
  }

  //inner join example: { from: "user", localField: "account", foreignField: "account", as: "user" }
  innerJoin(
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
  project(project: any) {
    this.pipeline.push({ $project: project });
    return this;
  }

  async query() {
    return await this.model.aggregate(this.pipeline);
  }

  async queryFirst() {
    const result = await this.model.aggregate(this.pipeline);
    return result.length > 0 ? result[0] : null;
  }

  pipe(pipeline: any) {
    this.pipeline.push(pipeline);
    return this;
  }

  //group example: { _id: "$account", count: { $sum: 1 } }
  groupBy(group: any) {
    this.pipeline.push({ $group: group });
    return this;
  }

  //sort example: { account: 1, username: -1 }
  sort(sort: any) {
    this.pipeline.push({ $sort: sort });
    return this;
  }

  limit(limit: number) {
    this.pipeline.push({ $limit: limit });
    return this;
  }

  skip(skip: number) {
    this.pipeline.push({ $skip: skip });
    return this;
  }

  unwind(prop: any) {
    this.pipeline.push({ $unwind: prop });
    return this;
  }
}
