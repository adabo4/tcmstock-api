import { Test, TestingModule } from '@nestjs/testing';
import { TabletsService } from './tablets.service';

describe('TabletsService', () => {
  let service: TabletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TabletsService],
    }).compile();

    service = module.get<TabletsService>(TabletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
