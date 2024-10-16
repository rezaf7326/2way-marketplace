import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { MatchWithProp } from '../common/custom-decorators';
import { Role } from '../common/enums';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum([Role.Buyer, Role.Seller])
  role: Role;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  password: string;

  @MatchWithProp('password')
  confirmPassword: string;
}
