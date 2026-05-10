import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExtensionService } from './extension.service';
import { ExtensionMethodDetailsResponseDto } from './dtos/extension-method-details-response.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ExtensionDetailsResponseDto } from './dtos/extension-details-response.dto';
import { ExtensionResponseDto } from './dtos/extension-response.dto';

@ApiTags('Extensions')
@Controller('extensions')
export class ExtensionController {
  constructor(private extensionService: ExtensionService) {}

  @Get('all/details')
  @ApiOperation({ summary: 'Get all details extensions' })
  @ApiOkResponse({
    type: [ExtensionDetailsResponseDto],
    description: 'All details extensions',
  })
  getDetailsExtensions(
    @I18n() i18n: I18nContext,
    @Query('search') searchString?: string,
  ): ExtensionDetailsResponseDto[] {
    return this.extensionService.getExtensionMethods(i18n, searchString);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all extensions' })
  @ApiOkResponse({
    type: [ExtensionResponseDto],
    description: 'All extensions',
  })
  getExtensions(@I18n() i18n: I18nContext): ExtensionResponseDto[] {
    return this.extensionService.getExtensions(i18n);
  }

  @Get('extension/:extensionId')
  @ApiOperation({ summary: 'Get detail extension' })
  @ApiOkResponse({
    type: ExtensionDetailsResponseDto,
    description: 'Detail extension',
  })
  getExtension(
    @Param('extensionId') extensionId: string,
    @I18n() i18n: I18nContext,
  ): ExtensionDetailsResponseDto {
    return this.extensionService.getExtension(extensionId, i18n);
  }

  @Get('method/:extensionId/:methodId')
  @ApiOperation({ summary: 'Get detail method' })
  @ApiOkResponse({
    type: ExtensionMethodDetailsResponseDto,
    description: 'Detail method',
  })
  getMethod(
    @Param('extensionId') extensionId: string,
    @Param('methodId') methodId: string,
    @I18n() i18n: I18nContext,
  ): ExtensionMethodDetailsResponseDto {
    return this.extensionService.getMethod(extensionId, methodId, i18n);
  }
}
