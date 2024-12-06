import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schema/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>
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
    const user = await this.userModel.findById(userId, '-password');
    if (!user) {
      throw new NotFoundException(`User with id ${userId} is not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
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

  async createUserCompany(createCompanyDto: CreateCompanyDto): Promise<CompanyDocument> {
    const companyExists = await this.companyModel.findOne({email: createCompanyDto.email});
    if (companyExists) {
      throw new BadRequestException(`Company with this email already exists`);
    }
    const company = await this.companyModel.create(createCompanyDto);
    return company;
  }

  async findUserCompany(companyId: string): Promise<CompanyDocument> {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new NotFoundException(`Company with id ${companyId} does not exist`);
    }
    return company;
  }

  async updateUserCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDocument> {
      const company = await this.companyModel.findById(companyId);
      if(!company){
        throw new NotFoundException(`Company with id ${companyId} does not exist`);
      }
      await this.companyModel.findByIdAndUpdate(
        companyId,
        updateCompanyDto,
        {
          new: true,
          runValidators: true,
        },
      );
      return company;
  }

  async deleteUser(email: string) {
    const user = await this.userModel
      .findOneAndDelete({ email })
      .select('-password');
    return {
      success: true,
      message: `User with email ${email} has been deleted`,
      data: user,
    };
  }
}
