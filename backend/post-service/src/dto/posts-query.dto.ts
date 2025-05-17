import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class PostsQueryDto {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	priceMin?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	priceMax?: number;

	@IsOptional()
	@IsString()
	tag?: string;

	@IsOptional()
	@IsString()
	nameContains?: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	page?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	limit?: number;
}
