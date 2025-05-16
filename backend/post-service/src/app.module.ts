import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileInterceptor } from "./common/profile.interceptor";
import { S3Service } from "./common/s3.service";
import { PostsModule } from "./posts/posts.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(
			process.env.MONGODB_URI ?? "mongodb://172.31.26.161:27017/postsdb"
		),
		PostsModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ProfileInterceptor, // Registrar el interceptor globalmente
		},
		S3Service,
	],
})
export class AppModule {}
