import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260916030054 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "home_block" ("id" text not null, "key" text not null, "data" jsonb not null, "active" boolean not null default true, "rank" integer not null default 0, "starts_at" timestamptz null, "ends_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "home_block_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_home_block_deleted_at" ON "home_block" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_home_block_key" ON "home_block" ("key") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "post" ("id" text not null, "title" text not null, "handle" text not null, "excerpt" text null, "content" text not null, "cover_image" text null, "author" text null, "seo_title" text null, "seo_description" text null, "status" text check ("status" in ('draft', 'published')) not null default 'draft', "published_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "post_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_deleted_at" ON "post" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_post_handle" ON "post" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_status_published_at" ON "post" ("status", "published_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "home_block" cascade;`);

    this.addSql(`drop table if exists "post" cascade;`);
  }

}
