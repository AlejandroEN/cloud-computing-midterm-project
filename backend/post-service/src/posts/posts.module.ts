import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { S3Service } from "../common/s3.service"; // Ajusta la ruta según donde esté el servicio
import { Posts, PostsSchema } from "../schemas/posts.schema";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Posts.name,
				schema: PostsSchema,
			},
		]),
	],
	controllers: [PostsController],
	providers: [PostsService, S3Service],
})
export class PostsModule {}
