/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./configs/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://ps_owner:LaJrly14pxjn@ep-holy-meadow-a5qh4nno.us-east-2.aws.neon.tech/ai-short-video-gen?sslmode=require",
  },
};
