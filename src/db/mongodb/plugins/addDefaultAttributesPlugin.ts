/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'mongoose';

// Define the audit plugin
export function addDefaultAttributesPlugin(schema: Schema) {
  // Add audit fields to the schema
  // schema.add({
  //   createdBy: { type: String, required: false },
  //   updatedBy: { type: String, required: false },
  //   deletedBy: { type: String, required: false },
  //   deletedAt: { type: Date, required: false },
  // });

  // Before creating a single document
  // schema.pre('save', async function (next: (err?: Error) => void) {
  //     const instance = this as any; // Use `as any` to bypass TypeScript strictness
  //     const options = instance.$locals.options; // Access options passed during save

  //     if (options?.userId && this.isNew) {
  //         if ('createdBy' in instance || 'created_by' in instance) {
  //             instance.createdBy = options.userId;
  //         }
  //     }

  //     if (options?.userId && this.isModified()) {
  //         if ('updatedBy' in instance || 'updated_by' in instance) {
  //             instance.updatedBy = options.userId;
  //         }
  //     }
  //     next();
  // });

  // Before updating multiple documents
  schema.pre('updateMany', async function (next: (err?: Error) => void) {
    const options: any = this.getOptions();
    const userId = options?.userId;
    const updateData: any = this.getUpdate();

    if (!updateData.deletedBy && userId) {
      this.setUpdate({
        ...updateData,
        updatedBy: userId,
      });
    } else if (updateData.deletedBy) {
      this.setUpdate({
        ...updateData,
        deletedBy: userId,
      });
    }
    next();
  });

  // Before updating single documents
  schema.pre('updateOne', async function (next: (err?: Error) => void) {
    const options: any = this.getOptions();
    const userId = options?.userId;
    const updateData: any = this.getUpdate();

    if (!updateData.deletedBy && userId) {
      this.setUpdate({
        ...updateData,
        updatedBy: userId,
      });
    } else if (updateData.deletedBy) {
      this.setUpdate({
        ...updateData,
        deletedBy: userId,
      });
    }
    next();
  });

  // Before deleting multiple documents
  // schema.pre('deleteMany', async function (next: (err?: Error) => void) {
  //     const options: any = this.getOptions();
  //     const userId = options?.userId;

  //     if (userId) {
  //         const conditions = this.getFilter();

  //         // Update `deletedBy` for all matched documents
  //         await mongoose.model(this.model.modelName).updateMany(
  //             conditions,
  //             { deletedBy: userId },
  //             { hooks: false }, // Prevent triggering additional hooks
  //         );
  //     }
  //     next();
  // });
}
