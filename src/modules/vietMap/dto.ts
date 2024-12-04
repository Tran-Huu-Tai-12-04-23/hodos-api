import { ApiProperty } from '@nestjs/swagger';

export class FindRouteDTO {
  @ApiProperty({
    description: 'Origin coordinates',
    example: { lat: 40.7128, lng: -74.006 },
  })
  origin: {
    lat: number;
    lng: number;
  };

  @ApiProperty({
    description: 'Destination coordinates',
    example: { lat: 34.0522, lng: -118.2437 },
  })
  destination: {
    lat: number;
    lng: number;
  };
}
