import { Model } from "mongoose";

export class MongoBuilder {
  private pipeline: any = [];
  private model: Model<any> | null = null;

  constructor(model?: Model<any>) {
    if (model) {
      this.model = model;
    }
  }

  From(model: Model<any>) {
    this.model = model;
    return this;
  }

  Where(predict: any) {
    this.pipeline.push({ $match: predict });
    return this;
  }

  Lookup(from: string, localField: string, foreignField: string, as: string) {
    this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
    return this;
  }

  LeftJoin(from: string, localField: string, foreignField: string, as: string) {
    this.pipeline.push({ $lookup: { from, localField, foreignField, as } });
    this.pipeline.push({
      $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true },
    });
    return this;
  }

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

  Project(project: any) {
    this.pipeline.push({ $project: project });
    return this;
  }

  async Query() {
    if (!this.model) {
      throw new Error("Model not set");
    }
    return await this.model.aggregate(this.pipeline);
  }

  async QueryFirstOrDefault() {
    if (!this.model) {
      throw new Error("Model not set");
    }
    const result = await this.model.aggregate(this.pipeline);
    return result.length > 0 ? result[0] : null;
  }

  Pipe(pipeline: any) {
    this.pipeline.push(pipeline);
    return this;
  }

  GroupBy(group: any) {
    this.pipeline.push({ $group: group });
    return this;
  }

  Sort(sort: any) {
    this.pipeline.push({ $sort: sort });
    return this;
  }

  Limit(limit: any) {
    this.pipeline.push({ $limit: limit });
    return this;
  }

  Skip(skip: any) {
    this.pipeline.push({ $skip: skip });
    return this;
  }

  Unwind(prop: any) {
    this.pipeline.push({ $unwind: prop });
    return this;
  }
}
