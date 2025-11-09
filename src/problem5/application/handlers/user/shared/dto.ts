export class UserDetailsDto {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare emailAddress: string;

  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.emailAddress = data.emailAddress;
  }
}
