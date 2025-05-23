import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserUpdateDto {
  @ApiPropertyOptional({ description: 'Họ và tên' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ hiện tại' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Liên kết GitHub' })
  @IsOptional()
  @IsString()
  githubLink?: string;

  @ApiPropertyOptional({ description: 'Liên kết Telegram' })
  @IsOptional()
  @IsString()
  telegramLink?: string;

  @ApiPropertyOptional({ description: 'Liên kết Facebook' })
  @IsOptional()
  @IsString()
  facebookLink?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử / mô tả ngắn' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Ảnh đại diện (URL)' })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ description: 'Giới tính (male, female, other)' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Quốc tịch' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ description: 'Sở thích du lịch (mô tả dạng chuỗi)' })
  @IsOptional()
  @IsString()
  travelInterests?: string;

  @ApiPropertyOptional({
    description: 'Lịch sử hành trình (JSON string hoặc danh sách ID)',
  })
  @IsOptional()
  @IsString()
  travelHistory?: string;

  @ApiPropertyOptional({ description: 'Ngôn ngữ sử dụng (ví dụ: "vi,en,fr")' })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiPropertyOptional({ description: 'Điểm đánh giá uy tín' })
  @IsOptional()
  @IsNumber()
  reputationScore?: number;
}
