import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePostDto {
	@ApiProperty()
	@IsOptional()
	title?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];

	@ApiProperty()
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	price?: number;

	@ApiProperty()
	@IsOptional()
	@IsString()
	presentation_card_id?: string;
}
