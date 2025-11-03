/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, CallbackWithoutResultAndOptionalError } from 'mongoose';

// Helper function to transform queries in aggregation stages
const transformQuery = (query: Record<string, any>) => {
    if (query.id) {
        query._id = query.id;
        delete query.id;
    }

    if (query.deletedAt === undefined && query.deletedBy === undefined) {
        query.deletedAt = { $exists: false };
    }
};

// Plugin to transform `id` to `_id` in all queries
const transformIdIdQueryPlugin = (schema: Schema) => {
    // List of query hooks where the transformation is applied
    const queryHooks = [
        'find',
        'findOne',
        'findOneAndUpdate',
        'findOneAndDelete',
        'findOneAndRemove',
        'updateOne',
        'updateMany',
        'deleteOne',
        'deleteMany',
        'count',
        'countDocuments',
    ];

    // Attach the transformation to each query type
    queryHooks.forEach(hook => {
        schema.pre(hook as RegExp | 'createCollection', function (this: mongoose.Query<any, any>, next: CallbackWithoutResultAndOptionalError) {
            const query = this.getQuery();
            transformQuery(query);
            next();
        });
    });

    // Special handling for `findById` since it directly deals with `_id`
    schema.pre('findById' as RegExp | 'createCollection', function (this: mongoose.Query<any, any>, next: CallbackWithoutResultAndOptionalError) {
        const query = this.getQuery();
        transformQuery(query);
        next();
    });

    // Special handling for aggregations
    schema.pre('aggregate', function (this: mongoose.Aggregate<any>, next: CallbackWithoutResultAndOptionalError) {
        const pipeline = this.pipeline();
        pipeline.forEach((stage: any) => {
            if (stage.$match) {
                transformQuery(stage.$match);
            } else if (stage.$lookup && stage.$lookup.pipeline) {
                stage.$lookup.pipeline.forEach((subStage: Record<string, any>) => {
                    if (subStage.$match) {
                        transformQuery(subStage.$match);
                    }
                });
            }
        });
        next();
    });
};

export default transformIdIdQueryPlugin;
