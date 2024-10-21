import { boolean, integer, json, pgTable, serial, varchar } from "drizzle-orm/pg-core";



export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // length is required for varchar
  email: varchar("email", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  subscription: boolean("subscription").default(false),
  credits: integer('credits').default(30) //30 Credits=3 videos
  
});
export const VideoData = pgTable("videoData", {
  id: serial("id").primaryKey(),
  script: json("script").notNull(),
  audioFileUrl: varchar(" audioFileUrl").notNull(),
  captions: json("captions").notNull(),
  imageList: varchar("imageList").array(),
  createdBy: varchar("createdBy").notNull(),
});