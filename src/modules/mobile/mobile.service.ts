import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PostEntity } from 'src/entities/post.entity';
import { UserDataDTO } from '../auth/dto';
import { FirebaseUploadService } from '../common/firebase-upload.service';
import { PostService } from '../post/post.service';
import { PostCreateDTO } from './dto/post.dto';

@Injectable()
export class MobileService {
  constructor(
    private readonly postService: PostService,
    private readonly firebaseService: FirebaseUploadService,
  ) {}

  //#region  travel blog
  async postPagination(data: PaginationDto<any>) {
    return await this.postService.pagination(data);
  }
  async postDetail(id: string) {
    return await this.postService.findOne(id);
  }
  async postCreate(
    user: UserDataDTO,
    post: PostCreateDTO,
    files: Express.Multer.File[],
  ) {
    const newPost = new PostEntity();
    newPost.title = `Post_${new Date().getTime()}`;
    newPost.content = post.content;

    // Extract tags from content using regex
    const tagRegex = /#(\w+)/g;
    const extractedTags = [];
    let match;
    while ((match = tagRegex.exec(post.content)) !== null) {
      extractedTags.push(match[1]);
    }
    newPost.tag = extractedTags.join(',');

    let uploadedUrls: string[] = [];

    if (files && files.length > 0) {
      // Upload each image to Firebase
      uploadedUrls = await Promise.all(
        files.map((file) =>
          this.firebaseService.uploadBufferImage(
            file.buffer,
            file.originalname,
          ),
        ),
      );

      newPost.imgs = uploadedUrls.join(',');
      newPost.thumbnail = uploadedUrls[0];
    }

    newPost.userId = user.id;
    newPost.createdBy = user.id;
    newPost.createdAt = new Date();
    newPost.createdByName = user.username;

    const res = await this.postService.create(newPost);

    return {
      message: 'Create post successfully',
      res,
    };
  }

  async postRemove(id: string) {
    return await this.postService.remove(id);
  }
  //#endregion
}
