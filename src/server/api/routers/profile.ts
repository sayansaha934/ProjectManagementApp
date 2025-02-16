import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Validation schema for profile update
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().url("Invalid image URL").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  emailNotifications: z.boolean().optional(),
  taskReminders: z.boolean().optional(),
});

export const profileRouter = createTRPCRouter({
  // Get current user profile
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        department: true,
        theme: true,
        emailNotifications: true,
        taskReminders: true,
        emailVerified: true,
        accounts: true,
        sessions: true,
        tasks: true,
        _count: true
      },
    });
  }),

  // Get all users for assignment dropdown
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
  }),

  // Update user profile
  update: protectedProcedure
    .input(profileUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      // Ensure only the authenticated user can update their own profile
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.image && { image: input.image }),
          ...(input.bio && { bio: input.bio }),
          ...(input.role && { role: input.role }),
          ...(input.department && { department: input.department }),
          ...(input.theme && { theme: input.theme }),
          ...(input.emailNotifications !== undefined && { emailNotifications: input.emailNotifications }),
          ...(input.taskReminders !== undefined && { taskReminders: input.taskReminders }),
        },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          role: true,
          department: true,
          theme: true,
          emailNotifications: true,
          taskReminders: true,
        },
      });
    }),
});
