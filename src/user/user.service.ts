import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, ObjectId } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schema/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UtilService } from 'src/utils/utils.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { Preference, PreferenceDocument } from './schema/preferences.schema';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Preference.name) private readonly preferenceModel: Model<PreferenceDocument>,
    private readonly utilService: UtilService
  ) {}
  async create(signUpDto: SignUpDto): Promise<UserDocument> {
    const userExists = await this.findUserByEmail(signUpDto.email);
    if (userExists) {
      throw new BadRequestException(`User with this email already exists`);
    }
    const user = await this.userModel.create(signUpDto);
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({}, '-password');
  }

  async findOne(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId, '-password')?.populate([{path: 'company'}, {path: 'preference'}]);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} is not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email })?.populate([{path: 'company'}, {path: 'preference'}]);
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        {
          new: true,
          runValidators: true,
          select: '-password',
        },
      );
      return user;
    } catch (error) {
      throw new NotFoundException(`User with id ${userId} does not exist`, {
        cause: error,
      });
    }
  }

  async createUserCompany(user: UserDocument,createCompanyDto: CreateCompanyDto): Promise<CompanyDocument> {
    const foundUser = await this.userModel.findById(user?._id);
    const companyExists = await this.companyModel.findOne({email: createCompanyDto.email});
    if (companyExists) {
      throw new BadRequestException(`Company with this email already exists`);
    }
    const company = (await this.companyModel.create({...createCompanyDto,owner: foundUser?._id}));
    foundUser.company = company;
    foundUser.save();
    return company;
  }

  async findUserCompany(user: UserDocument): Promise<CompanyDocument> {
    const company = await this.companyModel.findOne({owner: user?._id}).populate({path: 'owner', select: 'firstName lastName userName email profilePicture bio'});
    if (!company) {
      throw new NotFoundException(`User does not have any company`);
    }
    return company;
  }

  async updateUserCompany(
    user: UserDocument,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDocument> {
      const company = await this.companyModel.findOne({owner: user?._id});
      if(!company){
        throw new NotFoundException(`User does not have any company`);
      }
      await this.companyModel.findOneAndUpdate(
        {owner: user?._id},
        updateCompanyDto,
        {
          new: true,
          runValidators: true,
        },
      );
      return company;
  }

  async changeEmail(user: UserDocument,changeEmailDto: ChangeEmailDto){
    const foundUser = await this.userModel.findById(user?._id);
    if(!foundUser){
      throw new BadRequestException('User not found');
    }
    foundUser.email = changeEmailDto.email;
    foundUser.save();
    return {
      success: true,
      message: 'Email successfully changed',
    }
  }

  async changePassword(user: UserDocument,changePasswordDto: ChangePasswordDto){
    const foundUser = await this.userModel.findById(user?._id);
    if(!foundUser){
      throw new BadRequestException('User not found');
    }
    const isMatch = await this.utilService.comparePassword(changePasswordDto.currentPassword,foundUser.password);
    if(!isMatch){
      throw new BadRequestException('Incorrect Password');
    }
    const hashedPassword = await this.utilService.hashPassword(changePasswordDto.newPassword);
    foundUser.password = hashedPassword;
    foundUser.save();
    return {
      success: true,
      message: 'Password successfully changed'
    }
  }

  async createUserPreference(user: UserDocument,createPreferenceDto: CreatePreferenceDto): Promise<PreferenceDocument> {
    const foundUser = await this.userModel.findById(user?._id);
    const userPreferenceExists = await this.preferenceModel.findOne({user: foundUser?._id})
    if(userPreferenceExists){
      throw new BadRequestException('You have an existing preference, please continue to edit/update')
    }
    const preference = await this.preferenceModel.create({...createPreferenceDto, user: foundUser?._id});
    foundUser.preference = preference;
    foundUser.save();
    return preference;
  }

  async updateUserPreference(
    user: UserDocument,
    updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<PreferenceDocument> {
    const foundUser = await this.userModel.findById(user?._id);
    const userPreferenceExists = await this.preferenceModel.findOne({user: foundUser?._id});
    if(!userPreferenceExists){
      throw new BadRequestException('You do not have any existing preference, please create preference')
    }
    const preference = await this.preferenceModel.findOneAndUpdate(
      {user: foundUser?._id},
      updatePreferenceDto,
      {
        new: true,
        runValidators: true,
      },
    );    
    return preference;
  }

  async deleteUser(email: string) {
    const user = await this.userModel
      .findOneAndDelete({ email })
    return {
      success: true,
      message: `User with email ${user.email} has been deleted`,
    };
  }
}
