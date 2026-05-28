import { Test, TestingModule } from '@nestjs/testing';
import { TabletsController } from './tablets.controller';

describe('TabletsController', () => {
  let controller: TabletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TabletsController],
    }).compile();

    controller = module.get<TabletsController>(TabletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
