import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const taskCreateInput = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.union([z.string(), z.null()]).optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assignedTo: z.union([z.string(), z.null()]).optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

const taskUpdateInput = z.object({
  id: z.string().min(1, "Task ID is required"),
  title: z.string().optional().refine(val => val === undefined || val.trim().length > 0, {
    message: "Title cannot be an empty string"
  }),
  description: z.union([z.string(), z.null()]).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignedTo: z.union([z.string(), z.null()]).optional(),
  dueDate: z.date().optional(),
  tags: z.union([z.array(z.string()), z.null()]).optional(),
  updates: z.object({
    title: z.string().optional().refine(val => val === undefined || val.trim().length > 0, {
      message: "Title cannot be an empty string"
    }),
    description: z.union([z.string(), z.null()]).optional(),
    status: z.enum(["todo", "in-progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    assignedTo: z.union([z.string(), z.null()]).optional(),
    dueDate: z.date().optional(),
    tags: z.union([z.array(z.string()), z.null()]).optional(),
  }).optional(),
});

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskCreateInput)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database context is missing'
          });
        }

        // Validate assignedTo if provided
        if (input.assignedTo) {
          const user = await ctx.db.user.findUnique({
            where: { id: input.assignedTo },
            select: { id: true }
          });

          if (!user) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Invalid user ID for assignedTo'
            });
          }
        }

        return await ctx.db.task.create({
          data: {
            title: input.title,
            description: input.description ?? "",
            status: input.status,
            priority: input.priority,
            assignedTo: input.assignedTo,
            dueDate: input.dueDate,
            tags: input.tags ?? [],
            userId: ctx.session.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        console.error('Error creating task:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create task'
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database context is missing'
        });
      }

      const tasks = await ctx.db.task.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transform tasks to include assigned user name
      return tasks.map(task => ({
        ...task,
        assignedTo: task.assignedUser?.name ?? task.assignedUser?.email ?? task.assignedTo
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch tasks'
      });
    }
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        if (!ctx.db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database context is missing'
          });
        }

        // First, log the input and session details
        console.log('Task Get Request:', {
          inputId: input.id,
          userId: ctx.session.user.id
        });

        const task = await ctx.db.task.findUnique({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
          include: {
            assignedUser: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        });

        if (!task) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found'
          });
        }

        // Log the full task details before processing
        console.log('Raw Task Details:', {
          task: JSON.stringify(task, null, 2),
          assignedUserId: task.assignedTo,
          assignedUserObject: task.assignedUser
        });

        // Preserve the original assignedTo information
        const assignedToInfo = task.assignedUser 
          ? {
              id: task.assignedUser.id,
              name: task.assignedUser.name ?? task.assignedUser.email,
            }
          : (task.assignedTo 
              ? { id: task.assignedTo } 
              : null
            );

        console.log('Processed Assigned To Info:', {
          assignedToInfo,
          originalAssignedTo: task.assignedTo,
          assignedUserId: task.assignedUser?.id
        });

        // Construct the return object with explicit spreading
        const returnTask = {
          ...task,
          assignedTo: assignedToInfo,
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          tags: task.tags,
          userId: task.userId,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };

        console.log('Final Returned Task:', JSON.stringify(returnTask, null, 2));

        return returnTask;
      } catch (error) {
        console.error('Complete Error in Task Fetch:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch task'
        });
      }
    }),

  update: protectedProcedure
    .input(taskUpdateInput)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('Task Update Input:', JSON.stringify(input, null, 2));

        if (!ctx.db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database context is missing'
          });
        }

        // Validate user session
        if (!ctx.session?.user?.id) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User not authenticated'
          });
        }

        // Merge direct input with updates object
        const updateData = input.updates 
          ? { ...input, ...input.updates } 
          : input;

        // Remove the 'updates' property and 'id' from the data to be updated
        const { id, updates, ...dataToUpdate } = updateData;

        console.log('Processed Update Data:', JSON.stringify(dataToUpdate, null, 2));

        // Fetch the existing task to preserve assignedTo if not explicitly changed
        const existingTask = await ctx.db.task.findUnique({
          where: {
            id: id,
            userId: ctx.session.user.id,
          }
        });

        if (!existingTask) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found or you do not have permission to update it'
          });
        }

        // Validate assignedTo if provided
        if (dataToUpdate.assignedTo) {
          const user = await ctx.db.user.findUnique({
            where: { id: dataToUpdate.assignedTo },
            select: { id: true }
          });

          if (!user) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Invalid user ID for assignedTo'
            });
          }
        }

        // Prepare update data, explicitly handling null values
        const updatePayload: Record<string, unknown> = {
          updatedAt: new Date(),
        };
        // Explicitly handle each field
        if (dataToUpdate.title !== undefined) {
          updatePayload.title = dataToUpdate.title;
        }

        if (dataToUpdate.description !== undefined) {
          updatePayload.description = dataToUpdate.description === null ? null : dataToUpdate.description;
        }

        if (dataToUpdate.status !== undefined) {
          updatePayload.status = dataToUpdate.status;
        }

        if (dataToUpdate.priority !== undefined) {
          updatePayload.priority = dataToUpdate.priority;
        }

        if (dataToUpdate.dueDate !== undefined) {
          updatePayload.dueDate = dataToUpdate.dueDate;
        }

        if (dataToUpdate.tags !== undefined) {
          updatePayload.tags = dataToUpdate.tags === null 
            ? { set: [] }  // Set to empty array if null
            : { set: dataToUpdate.tags };
        }

        // Handle assignedTo separately to allow explicit removal
        if (dataToUpdate.assignedTo !== undefined) {
          updatePayload.assignedTo = dataToUpdate.assignedTo
        }

        console.log('Final Update Payload:', JSON.stringify(updatePayload, null, 2));

        return await ctx.db.task.update({
          where: {
            id: id,
            userId: ctx.session.user.id,
          },
          data: updatePayload,
        });
      } catch (error) {
        console.error('Complete Error in Task Update:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred during task update'
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database context is missing'
          });
        }

        return await ctx.db.task.delete({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.error('Error deleting task:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete task'
        });
      }
    }),
});
