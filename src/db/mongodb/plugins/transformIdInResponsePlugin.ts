/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Query, Schema } from 'mongoose';

const transformNestedDocs = (doc: any): any => {
  if (!doc || typeof doc !== 'object') {
    return doc; // Skip non-object or null values
  }

  if (Array.isArray(doc)) {
    return doc.map(transformNestedDocs); // Recursively process arrays
  }

  if (doc._id !== undefined) {
    doc.id = doc._id; // Map _id to id
    delete doc._id; // Remove _id
    delete doc.__v; // Optionally remove __v
  }

  // Recursively process nested objects
  for (const key of Object.keys(doc)) {
    if (!mongoose.Types.ObjectId.isValid(doc[key]) && doc[key] && typeof doc[key] === 'object') {
      doc[key] = transformNestedDocs(doc[key]);
    }
  }

  return doc;
};

const transformIdInResponsePlugin = (schema: Schema) => {
  // Apply `toJSON` and `toObject` transformations
  schema.set('toJSON', {
    virtuals: true,
    transform: (
      _,
      ret: {
        [x: string]: unknown;
      } & Required<{
        _id: unknown;
      }> & {
          __v?: number;
        },
    ) => {
      if (ret._id !== undefined) {
        ret.id = ret._id; // Map _id to id
        delete ret._id; // Remove _id
        delete ret.__v; // Optionally remove __v
      }
    },
  });

  schema.set('toObject', {
    virtuals: true,
    transform: (
      _,
      ret: {
        [x: string]: unknown;
      } & Required<{
        _id: unknown;
      }> & {
          __v?: number;
        },
    ) => {
      if (ret._id !== undefined) {
        ret.id = ret._id; // Map _id to id
        delete ret._id; // Remove _id
        delete ret.__v; // Optionally remove __v
      }
    },
  });

  // Enable lean globally
  schema.pre<Query<any, any>>(/^find/, function () {
    const options = this.getOptions();
    if (options.lean === undefined) {
      this.setOptions({ lean: true, ...options });
    }
  });

  // Middleware for lean query results
  schema.post(/^find/, function (docs, next) {
    transformNestedDocs(docs);
    next();
  });
};

export default transformIdInResponsePlugin;
