export interface Itree {
  Data: {
    AirlineCode: number;
    ErrorMsg: number;
    FlightNumber: string;
    HaveEMD: boolean;
    HaveETK: boolean;
    ID: number;
    IdAirportFrom: number;
    IdAirportTo: number;
    Name: string;
    Result: number;
    Segments: any[];
    Type: string;
  };
  ErrorDescSystem: string;
}
