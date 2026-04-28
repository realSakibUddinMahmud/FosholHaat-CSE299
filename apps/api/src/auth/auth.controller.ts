import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginResponse,
  LocalePreferenceResponse,
  RoleSelectionResponse,
  SignupResponse,
} from '@fosholhaat/types';
import { LoginRequestDto } from './dto/login-request.dto';
import { LocalePreferenceRequestDto } from './dto/locale-preference-request.dto';
import { RoleSelectionRequestDto } from './dto/role-selection-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponse> {
    return await this.authService.login(loginRequest);
  }

  @Post('locale')
  @HttpCode(HttpStatus.OK)
  async updateLocale(
    @Body() localeRequest: LocalePreferenceRequestDto,
  ): Promise<LocalePreferenceResponse> {
    return await this.authService.updateLocale(localeRequest);
  }

  @Post('role-selection')
  @HttpCode(HttpStatus.OK)
  async selectRole(
    @Body() roleRequest: RoleSelectionRequestDto,
  ): Promise<RoleSelectionResponse> {
    return await this.authService.selectRole(roleRequest);
  }

  @Post('signup/:role')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() request: SignupRequestDto): Promise<SignupResponse> {
    return await this.authService.signup(request);
  }
}
